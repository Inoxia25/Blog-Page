
var express=require("express");
var app=express();
var mongoose=require("mongoose"),
	expressSanitizer=require("express-sanitizer"),
	methodOverride=require("method-override");
app.use(express.static("public"));
app.use(methodOverride("_method"));
mongoose.connect("mongodb://Nandini:sne123@cluster0-shard-00-00.knzgk.mongodb.net:27017,cluster0-shard-00-01.knzgk.mongodb.net:27017,cluster0-shard-00-02.knzgk.mongodb.net:27017/blog_entries?ssl=true&replicaSet=atlas-n7zeo1-shard-0&authSource=admin&retryWrites=true&w=majority",{ useNewUrlParser: true, useUnifiedTopology: true });
//
var blogSchema=new mongoose.Schema({
	title: String, image: String, body: String, created:{type:Date, default: Date.now}
});
var Blog =mongoose.model("blog",blogSchema);
var bodyParser=require("body-parser");
	app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer()); //should come after body parser
/*Blog.create({
	title:"Test Blog",
	image: "https://i.pinimg.com/564x/9b/29/f6/9b29f6904a99654fdf2adbcecc9f0be5.jpg",
	body:"Ocean water. Calming and relaxed. Tranquil and peaceful. Blue and pink. Aesthetic and satisfying"
});*/
//Restful Routes

app.get("/",function(req,res){
	res.redirect("/blogs");
});
//IndexRoute
app.get("/blogs", function(req,res){
	Blog.find({}, function(err,blogs)
			 {
		if(err) console.log(err);
		else
		res.render("index.ejs",{blog:blogs});
	});
});
//New Route
app.get("/blogs/new",function(req,res){
	res.render("new.ejs");
})
//CREATE route
app.post("/blogs",function(req,res){
	req.body.blogs.body=req.sanitize(req.body.blogs.body);
	Blog.create(req.body.blogs,function(err,newBlog){
		if(err)
			res.redirect("/blogs/new");
		else
			res.redirect("/blogs");
	});
});
//SHOW routes
app.get("/blogs/:id",function(req,res){
	Blog.findById(req.params.id,function(err,newBlog)
				 {
		if(err)
			res.redirect("/blogs");
		else
			res.render("show.ejs", {blogs: newBlog});
	});
});
	//Edit Route
app.get("/blogs/:id/edit",function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog)
				 {
		if(err)
			res.redirect("/blogs");
		else
			res.render("edit.ejs", {blogs: foundBlog});
	});
});
//UPDATE route works with Post also but if we are doing restful routing, update with put request
app.put("/blogs/:id",function(req,res){
	req.body.blogs.body=req.sanitize(req.body.blogs.body);//to sanitize
	Blog.findByIdAndUpdate(req.params.id,req.body.blogs,function(err,updatedBlog){
		if(err)
			res.redirect("/blogs");
		else
			res.redirect("/blogs/"+req.params.id);
			
	});
	
});

//DELETE route
app.delete("/blogs/:id",function(req,res){
 Blog.findByIdAndRemove(req.params.id,function(err){
	 if ( err)
		 res.redirect("/blogs");
		else
			res.redirect("/blogs");
 });
});



app.listen(process.env.PORT ||3000, function(){ 
  console.log('Server listening on port 3000');
});