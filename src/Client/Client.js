var Utils = require('../Utils/Utils.js');
var Configuration = require('../Config/Configuration.js');
var THREE = require('three');


var Client = (function(){

    return function(){
    this.target = new THREE.Vector3( 0, 0, 0 );

    for(var config in Configuration){
        this[config] = Configuration[config];
    }

    for(var util in Utils){
        this[util] = Utils[util];
    }

    this.mouseX = 0;
    this.mouseY = 0;
    this.mouseWheel = 0;

    this.lat = 0;
    this.lon = 0;
    this.phi = 0;
    this.theta = 0;

    this.eulerOrder = "XYZ";

    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;
    this.moveUp = false;
    this.moveDown = false;
    this.AvatarPosition = new THREE.Vector3(0,0,0);

    this.currentTime = new Date().getTime();
    this.interp_value = 0.1;
    this.recvTime;
    this.latency;
    this.interp_buffer = [{ "ack": false, "time" : 0, "position" : this.target },
                         {"ack": false, "time" : 0, "position" : this.target }];

    this.interpolate = (function(){
            // admiting   interp_buffer[0].time < t < interp_buffer[1].time
            return function(vec, t){
                
                vec.x = this.interp_buffer[0].position.x +
                    ((this.interp_buffer[1].position.x - this.interp_buffer[0].position.x) /
                        ( this.interp_buffer[1].time - this.interp_buffer[0].time )) *
                            ( t * this.interp_buffer[0].time);
                
                vec.y = this.interp_buffer[0].position.y +
                    ((this.interp_buffer[1].position.y - this.interp_buffer[0].position.y) /
                        ( this.interp_buffer[1].time - this.interp_buffer[0].time )) *
                            ( t * this.interp_buffer[0].time);
                
                vec.z = this.interp_buffer[0].position.z +
                    ((this.interp_buffer[1].position.z - this.interp_buffer[0].position.z) /
                        ( this.interp_buffer[1].time - this.interp_buffer[0].time )) *
                            ( t * this.interp_buffer[0].time);
                
                this.interp_buffer.shift();
                
                return new THREE.Vector3(vec.x, vec.y, vec.z);
            }
        }());

    this.update = function (recv_data){
        this.currentTime = new Date().getTime();
        if(typeof recv_data.sentTime !== undefined){
            this.latency = this.currentTime - recv_data.sentTime;
            //console.log(this.latency);
        }


        //retrieve request variables into 'this'
        for(key in recv_data){
            if(key === "position" || key ===  "rotation"){
                this[key] = new THREE.Vector3(
                    recv_data[key].x,
                    recv_data[key].y, 
                    recv_data[key].z);
            } else {
                this[key] = recv_data[key];
            }
        }
        
        //INTERPOLATE 
        this.interp_buffer.push({
            "time" :  this.currentTime,
            "position" : this.position
        });
        
        var interp_time = this.currentTime - this.interp_value;

        var temp_pos = this.interpolate(this.position, interp_time);
        this.position.set(temp_pos.x, temp_pos.y, temp_pos.z);
        // END INTERPOLATION

        var actualMoveSpeed = 0;

        if (!this.freeze) {

            if (this.heightSpeed) {

                var y = THREE.Math.clamp(
                    this.position.y,
                    this.heightMin,
                    this.heightMax);
                var heightDelta = y - this.heightMin;

                this.autoSpeedFactor = this.delta *
                (heightDelta * this.heightCoef);

            } else {

                this.autoSpeedFactor = 0.0;

            }

            if (this.jump) {
                this.jumper();
            }
            actualMoveSpeed = this.delta * this.movementSpeed;

                if (this.moveForward || (this.autoForward &&
                    !this.moveBackward)){
                    this.translateZ(-(actualMoveSpeed + this.autoSpeedFactor));
            } 
            if (this.moveBackward) {
                this.translateZ(

                    actualMoveSpeed);
            }
            if (this.moveLeft){
             this.translateX(

                -actualMoveSpeed);
         }
         if (this.moveRight){
             this.translateX(

                actualMoveSpeed);
         }
         if (this.moveUp){ 
             this.translateY(

                 actualMoveSpeed);
         }
         if (this.moveDown) {
            this.position = this.translateY(

            -actualMoveSpeed);
    }
    var actualLookSpeed = this.delta * this.lookSpeed;

    if (!this.activeLook) {
        actualLookSpeed = 0;
    }



    this.lon += this.mouseX * actualLookSpeed;
    if (this.lookVertical) this.lat += this.mouseY * actualLookSpeed;

    this.lat = Math.max(-85, Math.min(85, this.lat));
    this.phi = (90 - this.lat) * Math.PI / 180;
    this.theta = this.lon * Math.PI / 180;

    var TargetPosition = this.target;
    var position = this.position;

    TargetPosition.x = position.x + (100 * Math.sin(this.phi) * Math.cos(this.theta));
    TargetPosition.y = position.y + (100 * Math.cos(this.phi));
    TargetPosition.z = position.z + (100 * Math.sin(this.phi) * Math.sin(this.theta));
    
    }

    var actualLookSpeed = this.delta * this.lookSpeed;

    var verticalLookRatio = 1;

    if (this.constrainVertical) {

        verticalLookRatio = Math.PI / (this.verticalMax - this.verticalMin);

    }
    this.lon += this.mouseX * actualLookSpeed;
    if (this.lookVertical) this.lat += this.mouseY * actualLookSpeed * verticalLookRatio;

    this.lat = Math.max(-85, Math.min(85, this.lat));
    this.phi = (90 - this.lat) * Math.PI / 180;

    this.theta = this.lon * Math.PI / 180;

    if (this.constrainVertical) {

        this.phi = THREE.Math.mapLinear(
            this.phi,
            0,
            Math.PI,
            this.verticalMin,
            this.verticalMax);
    }

    var TargetPosition = this.target;
    var position = this.position;

    TargetPosition.x = position.x + 100 * Math.sin(this.phi) * Math.cos(this.theta);
    TargetPosition.y = position.y + 100 * Math.cos(this.phi);
    TargetPosition.z = position.z + 100 * Math.sin(this.phi) * Math.sin(this.theta);
    
    return { 'TargetPosition' : TargetPosition, 'AvatarPosition' : this.position};

    };
    return this;
};
}());

module.exports = Client;