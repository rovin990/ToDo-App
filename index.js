import express from "express";
import bodyParser from "body-parser";

const app =express();
const port =3000;

var todayItems=[];
var workItems=[];
var isToday;



app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"))

app.get("/",(req,res)=>{
    isToday=true;
    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const d = new Date();
    let day1 = weekday[d.getDay()];
    let month1 =months[d.getMonth()]
    let date1 = d.getDate();
    res.render("index.ejs",{
        day : day1,
        month:month1,
        date : date1,
        todoType:isToday,
        items:todayItems
    })
})


app.post("/addTODO",(req,res)=>{
    var itemsAll=[];
    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const d = new Date();
    let day1 = weekday[d.getDay()];
    let month1 =months[d.getMonth()]
    let date1 = d.getDate();
    var newTODO = req.body.todo;
    if(isToday){
        todayItems.push(newTODO);
        itemsAll=todayItems;
    }
    else{
        workItems.push(newTODO);
        itemsAll=workItems;
    }
    
    res.render("index.ejs",{
        items:itemsAll,
        day : day1,
        month:month1,
        date : date1
    })

})
app.get("/work",(req,res)=>{
    isToday=false;
    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const d = new Date();
    let day1 = weekday[d.getDay()];
    let month1 =months[d.getMonth()]
    let date1 = d.getDate();
    res.render("index.ejs",{
        day : day1,
        month:month1,
        date : date1,
        todoType:isToday,
        items:workItems
    })
})




app.listen(port,()=>{
    console.log(`server is listening on ${port} port`)
})