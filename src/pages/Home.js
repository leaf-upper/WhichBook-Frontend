import React from 'react'
import Navigation from '../component/navigation/Navigation';
import Main from '../component/Main'
import Search from '../component/Home/Search'
import PreviewPageTitleContainer from '../component/Home/PreviewPageTitleContainer';
import PreviewWrapper from '../component/Home/PreviewWrapper';
import PreviewPageDo from '../component/Home/Do/PreviewPageDo'
import PreviewPageDoBuilder from '../component/Home/Do/PreviewPageDoBuilder';
import PreviewDoBuilder from '../component/Home/Do/PreviewDoBuilder';
import HomeStateDoBuilder from '../component/Home/Do/HomeStateDoBuilder';

class Home extends React.Component {

    getSnapshotBeforeUpdate

    componentDidMount() {
        this.onload();
    }

    onload = async () => {
        let pages = [] || [new PreviewPageDo()]
        pages = JSON.parse(localStorage.getItem("pages"));

        if (pages) {
            const newPages = pages.map(
                (page) => {
                    return new PreviewPageDoBuilder()
                        .setpageTitle(page.pageTitle)
                        .build()
                }
            )

            await this.setSyncState({
                pages: newPages
            })
            const activeIndex = pages.findIndex((page => page.checked));
            this.handleClickedPage(pages[activeIndex].pageTitle);
            return;
        }
        this.handleClickedPage("최신")
    }

    state = new HomeStateDoBuilder()
        .setQuery("")
        .setPages(
            [
                new PreviewPageDoBuilder()
                    .setpageTitle("trend")
                    .build(),
                new PreviewPageDoBuilder()
                    .setpageTitle("최신")
                    .build(),
            ]
        )
        .build();

    handleChangeQuery = (e) => {
        this.setState({
            query: e.target.value
        })
    }

    handleCreatePage = async () => {
        const { query, pages } = this.state;
        if (query.trim() === "") return;
        await this.clearQuery();

        if (pages.find(page => page.pageTitle === query)) {
            await this.handleClickedPage(query);
            return;
        }

        await this.setSyncState(
            new HomeStateDoBuilder()
                .setPages(
                    pages.concat(new PreviewPageDoBuilder()
                        .setpageTitle(query)
                        .build()
                    )
                )
                .build()
        )

        await this.handleClickedPage(query);
    }

    handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.handleCreatePage();
        }
    }

    handleClickedPage = async (pageTitle) => {
        const { pages } = this.state;
        const CurrentPageIndex = this.getActivedPageIndex();
        const ClickedPageIndex = pages.findIndex(page => page.pageTitle === pageTitle);

        if (ClickedPageIndex === CurrentPageIndex) return;

        await this.togglePageByIndex(CurrentPageIndex);
        await this.togglePageByIndex(ClickedPageIndex);
        await this.handleActivedPage(pageTitle);
        localStorage.setItem("pages", JSON.stringify(this.state.pages));
    }

    handleActivedPage = async (pageTitle) => {
        const { pages } = this.state;
        const pageIndex = pages.findIndex((page) => page.pageTitle === pageTitle);
        const page = pages[pageIndex]

        if (page.previews.length === 0) {
            page.previews = page.previews.concat(
                new PreviewDoBuilder()
                    .setTitle(page.pageTitle)
                    .setImgURL("https://bookthumb-phinf.pstatic.net/cover/164/054/16405427.jpg?udate=20201222")
                    .setDescription("만들어진 꿈을 살 수있는")
                    .setCreatedAt("2020년 12월 13일")
                    .setAuthor("jinseongho")
                    .setId("1")
                    .build()
            )

            const newPages = pages;
            newPages[pageIndex] = page;
            await this.setSyncState({
                pages: newPages
            })
        }
    }

    handleRemovePage = async (pageTitle) => {
        if (pageTitle === "최신") return;
        if (pageTitle === "trend") return;

        if (this.isActivePage(pageTitle)) {
            await this.togglePageByIndex(this.getActivedPageIndex() - 1);
        }

        const { pages } = this.state;
        await this.setSyncState(
            { pages: pages.filter(page => page.pageTitle !== pageTitle) }
        )

        localStorage.setItem("pages", JSON.stringify(this.state.pages));
    }

    setSyncState(state) {
        return new Promise((resolve, reject) => {
            this.setState(state, () => {
                resolve()
            })
        })
    }

    clearQuery = async () => {
        const { pages } = this.state;
        await this.setSyncState(
            new HomeStateDoBuilder()
                .setPages(pages)
                .setQuery("")
                .build()
        )
    }

    togglePageByIndex = async (pageIndex) => {
        if (pageIndex < 0) return;
        const { pages } = this.state;
        const page = pages[pageIndex];
        const nextPages = [...pages];
        nextPages[pageIndex] = {
            ...page,
            checked: !page.checked
        }
        await this.setSyncState(
            { pages: nextPages }
        )
    }

    togglePageByPageTitle = (pageTitle) => {
        const { pages } = this.state;
        const pageIndex = pages.findIndex(page => page.pageTitle === pageTitle);
        this.togglePageByIndex(pageIndex);
    }

    getActivedPageIndex = () => {
        const { pages } = this.state;
        const currentIndex = pages.findIndex((page) =>
            page.checked);
        return currentIndex;
    }

    isActivePage(pageTitle) {
        const { pages } = this.state;
        const currentIndex = pages.findIndex((page) =>
            page.pageTitle === pageTitle);
        const page = pages[currentIndex];
        return page.checked;
    }

    render() {
        const { pages, query } = this.state;

        const {
            handleKeyPress,
            handleChangeQuery,
            handleClickedPage,
            handleRemovePage
        } = this;
        return (
            <Main>
                <Navigation />
                <Search
                    query={query}
                    onChangeQuery={handleChangeQuery}
                    onKeyPress={handleKeyPress}
                />
                <PreviewPageTitleContainer
                    pages={pages}
                    onClick={handleClickedPage}
                    onRemove={handleRemovePage}
                />
                <PreviewWrapper
                    pages={pages}
                />
            </Main>
        )
    }
}

export default Home;