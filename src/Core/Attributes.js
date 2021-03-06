if(typeof global != 'undefined'){
    var THREE = require('three');
    var Materials = require('./Materials.js');

}

var Attributes = {
  Avatar :  {
    displacement : {
      type : 'f', // a float
      value : [] // an empty array
    }
  },

  Origin : function(ORIGIN_COLOR, ORIGIN_SIZE, WORLDSIZE){

    var OriginMaterialX = Materials.Origin_MaterialsX( 1,0.,0., ORIGIN_COLOR);
    var OriginMaterialY = Materials.Origin_MaterialsY( 0.,1,0., ORIGIN_COLOR);
    var OriginMaterialZ = Materials.Origin_MaterialsZ( 0.,0.,1, ORIGIN_COLOR);

    //X
    var xOrigin = new THREE.Mesh(                               //MESH
    new THREE.CubeGeometry(
        WORLDSIZE,
        ORIGIN_SIZE,
        ORIGIN_SIZE),
        OriginMaterialX
    );

    xOrigin.position.x = 0;
    xOrigin.position.y =  ORIGIN_SIZE/2;
    xOrigin.position.z = 0;

    // Y

    var yOrigin = new THREE.Mesh(                               //MESH
    new THREE.CubeGeometry(
        ORIGIN_SIZE,
        WORLDSIZE,
        ORIGIN_SIZE),
        OriginMaterialY
    );

    yOrigin.position.x = 0;
    yOrigin.position.y =  ORIGIN_SIZE;
    yOrigin.position.z = 0;

    //Z
    var zOrigin = new THREE.Mesh(                               //MESH
        new THREE.CubeGeometry( ORIGIN_SIZE,  ORIGIN_SIZE,  WORLDSIZE),
        OriginMaterialZ
    );

    zOrigin.position.x = 0;
    zOrigin.position.y =  ORIGIN_SIZE/2;
    zOrigin.position.z = 0;

    return new Array(xOrigin, yOrigin, zOrigin);
  }
};


if(typeof global != 'undefined'){
    module.exports = global.Attributes = Attributes;
}
