var express     = require("express"),
expressSanitizer= require("express-sanitizer"),
bodyparser     = require("body-parser"),
mongoose       = require("mongoose"),
methodOverride = require("method-override"),
app            = express();
    
    
    
    mongoose.connect("mongodb://localhost/restful_blog_app");
    
    app.use(express.static("public"));
    
    app.use(bodyparser.urlencoded({extended : true}));
    
    app.use(expressSanitizer()); // needs to be after body-parser
    
    app.use(methodOverride("_method"));
    
    
    var blogSchema = new mongoose.Schema({
        
        title:String,
        image:String,
        body:String,
        created : {type:Date , default: Date.now()}
        
    })
    
    var Blog = mongoose.model("Blog",blogSchema)
    
    // Blog.create({
        
    //     title:"First",
    //     image: "https://images.unsplash.com/photo-1480444423787-9ea7b1509c54?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=5b5d4b1832194f5e9847aaeb247622f5&auto=format&fit=crop&w=500&q=60",
    //     body: "Test1",
        
        
        
    // },function(err,newBlog){
    //     if(err){
    //         console.log(err)
    //     }
        
    //     else{
    //         console.log("Created")
    //     }
        
    // })
    
    
    app.get("/",function(req, res) {
        res.redirect("/blogs")
    })
    
    
    app.get("/blogs",function(req,  res){
        
        Blog.find({},function(err,blogs){
            
            if(err){
                console.log(err)
            }
            
            else{
                 res.render("index.ejs",{blogs:blogs})
            }
            
        })
    })

    app.get("/blogs/new",function(req, res) {
        res.render("newBlog.ejs")
    })
    
    
    app.post("/blogs",function(req , res){
        var blogTitle = req.body.blog.title;
        var blogImage = req.body.blog.image;
        var blogBody = req.body.blog.body;
    
    if( req.body.blog.title && req.body.blog.image && req.body.blog.body){
        req.body.blog.body = req.sanitize(req.body.blog.body)
        
        Blog.create({
            
            title: blogTitle,
            image: blogImage,
            body: blogBody
            
            
        },function(err,newBlog){
            
            if(err){
                console.log(err)
            }
            else{
                res.redirect("/blogs")
            }
            
        })
        
    }
    else{
        res.redirect("/blogs")
    }
        
        
        
    })

app.get("/blogs/:id",function(req, res){
    
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            console.log(err)
        }
        
        else{
            res.render("blogInfo.ejs",{blog:foundBlog})
        }
    })
    
})

app.get("/blogs/:id/edit",function(req, res) {
    
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            console.log(err)
        }
        
        else{
            res.render("editBlog.ejs",{blog:foundBlog})
        }
        
    })
})

app.put("/blogs/:id",function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err , updatedBlog){
        
        if(err){
        console.log(err)
    }
    
    else{
        res.redirect("/blogs/" + req.params.id)
    }
    })
})

app.delete("/blogs/:id",function(req, res){
    
    Blog.findByIdAndRemove(req.params.id,function(err){
        
        if(err){
        console.log(err)
    }
    
    else{
        res.redirect("/blogs")
    }
    })
    
})

app.listen(process.env.PORT,process.env.IP,function(){
    
    console.log("Blog App Server Start")
} )