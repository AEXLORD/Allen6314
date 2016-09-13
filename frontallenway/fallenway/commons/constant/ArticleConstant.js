var ArticleConstant = function(){

    //每页文章数量
    var ARTICLE_PAGE_SIZE = 10;

    this.getArticlePageSize = function(){
        return ARTICLE_PAGE_SIZE;
    }
}

module.exports = ArticleConstant;
