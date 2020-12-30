class PreviewDo{
    constructor(){
        this.imgURL = "";
        this.title = "";
        this.description = "";
        this.createdAt = "";
        this.author = "";
        this.id = 0;
    }
}

class PreviewDoBuilder{
    constructor(){
        this.PreviewDo = new PreviewDo();
    }

    setImgURL(imgURL){
        this.PreviewDo.imgURL = imgURL;
        return this;
    }

    setTitle(title){
        this.PreviewDo.title = title;
        return this;
    }

    setDescription(description){
        this.PreviewDo.description = description;
        return this;
    }

    setCreatedAt(createdAt){
        this.PreviewDo.createdAt = createdAt;
        return this;
    }

    setAuthor(author){
        this.PreviewDo.author = author;
        return this;
    }

    setId(id){
        this.PreviewDo.id = id;
        return this;
    }

    build(){
        return this.PreviewDo;
    }
}

export default PreviewDoBuilder;