import React,{useEffect,useCallback,useState} from 'react'
import { useParams } from 'react-router';
import Quill  from 'quill'
import {io} from "socket.io-client";
import "quill/dist/quill.snow.css"

const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],
  
    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction
  
    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  
    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],
  
    ['clean']                                         // remove formatting button
  ];



function Texteditor() {
  
    const [socket,setSocket]= useState();
    const [quill,setQill]= useState();
    const {id:documentId} = useParams();


    useEffect(()=>{
        if(socket==null || socket==null) return;
        const handler=(delta,oldDelta,source)=>{
            if(source!=="user") return;
            socket.emit("send-changes",delta)}

      quill.on("text-change",handler)
      

      return ()=>{
        quill.off("text-change",handler)
      }

   

     
    },[socket,quill])

    useEffect(()=>{
        if(socket==null || socket==null) return;
        const handler=(delta)=>{
            quill.updateContents(delta)
        }

      socket.on("receive-changes",handler)
      

      return ()=>{
        socket.off("receive-changes",handler)
      }

    },[quill,socket])


    useEffect(()=>{
        if(socket==null || socket==null) return;

        const interval= setInterval(()=>{

            socket.emit("save-document",quill.getContents())

        },2000)
      
      

      return ()=>{
       clearInterval(interval);
      }

    },[quill,socket])


    useEffect(()=>{
        if(socket==null || socket==null) return;
       
        socket.once("load-document",document=>{
            quill.setContents(document);
            quill.enable()
        })
         socket.emit("get-document",documentId)
      

     
    },[quill,socket,documentId])



    useEffect(()=>{

        const s =io("http://localhost:5000");
        setSocket(s);
        return ()=>{
            s.disconnect();
        } // return a function to disconnect the server once we are done
    
    },[])
// const wrapRef=useRef();
// this is a flexible react hook , ref does not cause a component to reupdate when changed unlike state.
// this input ref just has a current property which is like the value of the so called state like thing created
// primarily used to access the dom elements , also it can be used to store previous value of the state


const wrapRef= useCallback((wrapper) => {

    // here wrapper is the element that is being rendered on the page
 
        if(wrapper==null) return;
        wrapper.innerHTML="";
        const editor =document.createElement("div");
        wrapper.append(editor);
        const q=new Quill(editor,{theme:"snow",modules:{toolbar:toolbarOptions}});
        q.disable();
        q.setText("Wait for it to be available.....")
       
        setQill(q);
        

    }, [])

    
    return (
        <div class="container" ref={wrapRef}>

            this is the text editor nigga
            
        </div>
    )
}

export default Texteditor
