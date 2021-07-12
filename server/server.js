const Document = require("./models/document.js")
const mongoose= require("mongoose")
const dotenv=require("dotenv");

dotenv.config({path:"./config.env"})
const mongoURI=process.env.DATABASE;
mongoose.connect(mongoURI,{

    useNewUrlParser:true,
    useUnifiedTopology:true,
    useFindAndModify:true,
    useCreateIndex:true,
    useFindAndModify:false
    

});
const io = require("socket.io")(5000,{
    cors:{
        origin:"http://localhost:3000",
        methods:["GET","POST"],
    }, // we used cors because client and server are on different ports and we need to communicate between them
});

async function findOrCreateDocument(id){
    if(id==null) return;
    const document= await Document.findById(id);
    if(document) return document
    else return await Document.create({
        _id:id,
        data:""
    })
}
io.on("connection",(socket)=>{

   socket.on("get-document",async documentId=>{
       const document= await findOrCreateDocument(documentId);
       socket.join(documentId); // makes a common room based on id
       socket.emit("load-document",document.data) // emits the data to the id when doc is loaded
       socket.on("send-changes",delta=>{

        socket.broadcast.to(documentId).emit("receive-changes",delta)
        // brodacasts the changes
     })

     socket.on("save-document",async data=>{
         await Document.findByIdAndUpdate(documentId,{data})
     })

   })
  

     
})


