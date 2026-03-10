function FileCard({file}){

return(

<div className="file-card">

<div className="icon">📄</div>

<p>{file.originalName}</p>

</div>

)

}

export default FileCard