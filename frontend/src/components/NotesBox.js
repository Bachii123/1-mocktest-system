import {useState} from "react";

export default function NotesBox(){

const [note,setNote]=useState("")

return(

<div>

<p>Notes :</p>

<textarea
rows="3"
style={{width:"100%"}}
placeholder="Write formulas or solving steps..."
value={note}
onChange={(e)=>setNote(e.target.value)}
/>

</div>

)
}