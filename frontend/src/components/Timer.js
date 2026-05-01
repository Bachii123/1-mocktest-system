import {useState,useEffect} from "react";

export default function Timer({duration,onTimeUp}){

const [time,setTime]=useState(duration*60);

useEffect(()=>{

 if(time<=0){
   onTimeUp();
   return;
 }

 const interval=setInterval(()=>{
   setTime(t=>t-1)
 },1000)

 return ()=>clearInterval(interval)

},[time])

const minutes=Math.floor(time/60)
const seconds=time%60

return(
<div className="timer">
Time Left : {minutes}:{seconds<10?"0":""}{seconds}
</div>
)
}