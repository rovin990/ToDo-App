import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const app = express();
const port= 3000;
const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const d = new Date();
const day1 = weekday[d.getDay()];
const month1 =months[d.getMonth()]
const date1 = d.getDate();

var dbToDo;
var todayItems=[];
var workItems=[];
var dbToDo =[];
var isToday;

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://0.0.0.0:27017/todolistDB");
const todoSchema = mongoose.Schema({
    name:String,
    todoType:Boolean
});
const todoModel = mongoose.model("ToDo",todoSchema);



app.get("/", async(req,res)=>{
    isToday=true;
    try {
        dbToDo= await todoModel.find({},{_id:false,name:true,todoType:true});
        todayItems=[];
        workItems=[];
        dbToDo.forEach(todo=>{
            if(todo.todoType)todayItems.push(todo.name)
            else workItems.push(todo.name)
            console.log(todo)
        })
        const data={
            day : day1,
            month:month1,
            date : date1,
            todoType:isToday,
            items:todayItems
        }
        res.render("index.ejs",data)

    } catch (error) {
        
    }
    
})

app.post("/addTODO",async(req,res)=>{
    var itemsAll=[];
    var newTODO = req.body.taskType;
    if(isToday){
        const todoDoc = new todoModel({
            name : newTODO,
            todoType : true
        })
        todoDoc.save();
        todayItems.push(newTODO);
        itemsAll=todayItems;
    }else{
        const todoDoc = new todoModel({
            name : newTODO,
            todoType : false
        })
        todoDoc.save();
        workItems.push(newTODO);
        itemsAll=workItems;
    }
    const data={
        day : day1,
        month:month1,
        date : date1,
        todoType:isToday,
        items:itemsAll
    }
    res.render("index.ejs",data)
})


app.get("/work", async(req,res)=>{
    isToday=false;
    try {
        dbToDo= await todoModel.find({},{_id:false,name:true,todoType:true});
        todayItems=[];
        workItems=[];
        dbToDo.forEach(todo=>{
            if(todo.todoType)todayItems.push(todo.name)
            else workItems.push(todo.name)
            console.log(todo)
        })
        const data={
            day : day1,
            month:month1,
            date : date1,
            todoType:isToday,
            items:workItems
        }
        res.render("index.ejs",data)

    } catch (error) {
        
    }
    
})



app.listen(port,()=>{
    console.log(`Server is running on ${port} port .`);
})