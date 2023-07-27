import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const app =express();
const port =3000;
const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"))

var todayItems=[];
var workItems=[];
var dbToDo =[];
var isToday;


// db connection
main().catch(err => console.log(err));
async function main() {
    await mongoose.connect("mongodb://0.0.0.0:27017/todolistDB");
}
const todoSchema = new mongoose.Schema({ 
    name:{
        type : String,
        required :[true ,"Do somethihng?"]
    },
    todoType : {
        type : Boolean,
        required :[true,"tell me what type this TODO ?"]
    }
});
const todoModel = mongoose.model("ToDo",todoSchema);

// db setup end
async function fetchTodo(res){
    dbToDo =  await todoModel.find({},{_id:false,name:true,todoType:true});
    todayItems=[];
    workItems=[];
    dbToDo.forEach(todo=>{
        if(todo.todoType)todayItems.push(todo.name)
        else workItems.push(todo.name)
        console.log(todo)
    })
    renderTODO(res)    
}




function renderTODO (res){
    var data ;
    const d = new Date();
     let day1 = weekday[d.getDay()];
     let month1 =months[d.getMonth()]
     let date1 = d.getDate();
     if(isToday){
        data=todayItems;
     }else{
        data=workItems;
     }
     res.render("index.ejs",{
         day : day1,
         month:month1,
         date : date1,
         todoType:isToday,
         items:data
     })     
 }





app.get("/",(req,res)=>{
    isToday=true;
    try{
        fetchTodo(res);
    }finally{
        console.log("finally ");
    }
})


app.post("/addTODO",(req,res)=>{
    var itemsAll=[];
    const d = new Date();
    let day1 = weekday[d.getDay()];
    let month1 =months[d.getMonth()]
    let date1 = d.getDate();
    var newTODO = req.body.taskType;
    
    if(isToday){
        
        try {
            const todoDoc = new todoModel({
                name : newTODO,
                todoType : true
            })
            todoDoc.save();
        } catch (err) {
            if(err)console.log(err);
            
        }
        todayItems.push(newTODO);

        itemsAll=todayItems;
        console.log("for today : ",isToday);
    }
    else{
        try {
            const todoDoc = new todoModel({
                name : newTODO,
                todoType : false
            })
            todoDoc.save();
        } catch (err) {
            if(err)console.log(err);
            
        }
        workItems.push(newTODO);
        itemsAll=workItems;
        console.log("for work : ",isToday);
    }
    
    res.render("index.ejs",{
        items:itemsAll,
        day : day1,
        month:month1,
        todoType:isToday,
        date : date1
    })

})
app.get("/work",(req,res)=>{
    isToday=false;
    try{
        fetchTodo(res);
    }catch(err){
        console.log(err);
    }
})




app.listen(port,()=>{
    console.log(`server is listening on ${port} port`)
})