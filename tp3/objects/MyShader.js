import * as THREE from 'three';

/** Represents a plane with nrDivs divisions along both axis, with center at (0,0) */
class MyShader {
	constructor(app, name, description = "no description provided", vert_url, frag_url, uniformValues = null) {
               
          this.app = app;
          this.name = name
          this.description = description
          this.vert_url = vert_url;
          this.frag_url = frag_url;
          this.uniformValues = uniformValues
          
          this.material = null
          this.ready = false
          this.read(vert_url, true)
          this.read(frag_url, false)
     }

     updateUniformsValue(key, value) {
          if (this.uniformValues[key]=== null || this.uniformValues[key] === undefined) {
               console.error("shader does not have uniform " + key)
               return;
          }

          this.uniformValues[key].value = value

          if (this.material !== null) {
               this.material.uniforms[key].value = value
          }
     }

     read(theUrl, isVertex) {
          let xmlhttp = null
          if (window.XMLHttpRequest) xmlhttp=new XMLHttpRequest(); // code for IE7+, Firefox, Chrome, Opera, Safari
          
          else xmlhttp=new ActiveXObject("Microsoft.XMLHTTP"); // code for IE6, IE5
          
          let obj = this
          xmlhttp.onreadystatechange=function() {
               if (xmlhttp.readyState==4 && xmlhttp.status==200) {
                    
                    if (isVertex) obj.vertexShader = xmlhttp.responseText 
                    
                    else obj.fragmentShader = xmlhttp.responseText
                    
                    obj.buildShader.bind(obj)()
               }
          }
          xmlhttp.open("GET", theUrl, true)
          xmlhttp.send()
     }

     buildShader() {

          if (this.vertexShader !== undefined && this.fragmentShader !== undefined) {
               // build the shader material
               this.material = new THREE.ShaderMaterial({
                    // load uniforms, if any
                    uniforms: (this.uniformValues !== null ? this.uniformValues : {}),
                    vertexShader: this.vertexShader,
                    fragmentShader: this.fragmentShader,
               }) 

               this.ready = true
          }
     }

     hasUniform(key) {
          return this.uniformValues[key] !== undefined
     }
}
export { MyShader }

