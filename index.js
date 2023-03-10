/*
----------------------------------------------
 *  Project:   Pixel Pet Clock Face
 *  Mail:       darahbass@gmail.com
 *  Github:     SarahBass
 ---------------------------------------------
 NOTES: 
 This Clock will be larger than normal
 because it has so many animations. 
 
 Images are ALL original artwork 
 ---------------------------------------------
*/

/*--- Import Information from user Account ---*/
import { settingsStorage } from "settings";
import { me as appbit } from "appbit";
import { HeartRateSensor } from "heart-rate";
import clock from "clock";
import * as document from "document";
import { preferences } from "user-settings";
import * as util from "../common/utils";
import { battery } from 'power';
import { display } from "display";
import { today as userActivity } from "user-activity";
import {goals, today} from "user-activity";
import { units } from "user-settings";
import * as document from "document";
import { Accelerometer } from "accelerometer";


/*--- Create Local Variables for Information Storage ---*/
let daytext = "day";
let monthtext = "month";
let goalreached = "NONE";


/*--- Import Information from index.gui ---*/

let background = document.getElementById("background");
let ampm = document.getElementById("ampm");  
let evolution = document.getElementById("evolution"); 
let date = document.getElementById("date");
let pet = document.getElementById("pet");
let object = document.getElementById("object");
let poop = document.getElementById("poop");
let buttonnumber = 0;
let poops = 0;
let petnaughty = 0;
let basic = 0;
//Update the clock every second 
clock.granularity = "seconds";

// Get a handle on the <text> elements 
const myLabel = document.getElementById("myLabel");
const batteryLabel = document.getElementById("batteryLabel");
const stepsLabel = document.getElementById("stepsLabel");
const firelabel = document.getElementById("firelabel");
const boltlabel = document.getElementById("boltlabel");
const heartlabel = document.getElementById("heartlabel");
const stairslabel = document.getElementById("stairslabel");
const distancelabel = document.getElementById("distancelabel");
const button1 = document.getElementById("button-1");
var demoinstance = document.getElementById("demoinstance");
var demogroup = demoinstance.getElementById("demogroup");

  
  if (HeartRateSensor && appbit.permissions.granted("access_heart_rate")) {
   const hrm = new HeartRateSensor();
  hrm.addEventListener("reading", () => {
    heartlabel.text = (`${hrm.heartRate}`);

  });
  display.addEventListener("change", () => {
    // Automatically stop the sensor when the screen is off to conserve battery
    display.on ? hrm.start() : hrm.stop();
  });
  hrm.start();
  }else {heartlabel.text = "off";}



/*--- CLOCK START ---*/
clock.ontick = (evt) => {

  let today = evt.date;
  let hours = today.getHours();
  let months = today.getMonth();
  let days = today.getDay();
  let dates = today.getDate();
  let years = today.getFullYear();
  let mins = util.zeroPad(today.getMinutes());
  let seconds = today.getSeconds();
  
  demoinstance.animate("enable"); 

 /*--- Update Stats for Screen ---*/
  updateScene();
  if (units.distance == "us"){
  distancelabel.text = (0.000621371 * userActivity.adjusted.distance).toFixed(1) + " mi";}
  else {distancelabel.text = (0.001 * userActivity.adjusted.distance).toFixed(1) + " km";}

  stairslabel.text = userActivity.adjusted.elevationGain;
  stepsLabel.text = userActivity.adjusted.steps;
  firelabel.text = userActivity.adjusted.calories;
 // targetlabel.text = parseInt(userActivity.adjusted.steps/goals.steps * 100) + "%";
  boltlabel.text = userActivity.adjusted.activeZoneMinutes.total;
  heartlabel.text = "off";  
  checkAndUpdateBatteryLevel();

  
  //AM PM -Change the image based on 24 hours
  if (util.zeroPad(hours) >= 12){ampm.text = "PM";}
  else{ampm.text = "AM";}
  
  
  //Change Pet Animations

  
  
 //Pet creates waste based on steps 
  if ((userActivity.adjusted.steps%100) == 0){poops++;}
  if (poops <= 0 ) {poops = 0;}
  if (poops >= 5){poops = 5}
  
  //Not Cleaning makes Pet Naughty
  if ( petnaughty >= 1000){petnaughty = 1000;}
  if (petnaughty <= 0){petnaughty = 0;}
  
  //Sleeping increases cuteness level of form
  if (basic >= 1000){basic = 1000;}
  if (basic <= 0){basic = 0;} 
  
  //Change animation in background to show game over or pet waste
  if (userActivity.adjusted.steps < goals.steps/5){poop.image = "blank.png";}
  else if ((userActivity.adjusted.steps > goals.steps/5) &&  (userActivity.adjusted.steps < goals.steps)){
    
    //Move hand to clean Pet Poop only if poop level is more than 0
    //Reduce Accelerometer as much as possible and use batches and lower frequency
  if (poops > 0){
 if (Accelerometer) {
   //console.log("Poop Level: " + poops);
   //console.log("Naughty Level: " + petnaughty);
   //console.log("Basic Level: " + basic);
   const accelerometer = new Accelerometer({ frequency: 30, batch: 60 });
   accelerometer.addEventListener("reading", () => { 
    if (accelerometer.y < 2){   
      poops--;}
  });  
    display.addEventListener("change", () => {
    // Automatically stop the sensor when the screen is off to conserve battery
    display.on ? accel.start() : accel.stop();
  });
       accelerometer.start();
  }
  else {console.log("This device does NOT have an Accelerometer!");}
  }
    
  if (poops == 0) {
     if (seconds % 2 == 0){poop.image = "poop/sun0.png";}
     else{poop.image = "poop/sun1.png";}}
  else if (poops == 1) {
     if (seconds % 2 == 0){poop.image = "poop/poop0.png";}
     else{poop.image = "poop/poop1.png";}}
  else if (poops == 2) {
     if (seconds % 2 == 0){poop.image = "poop/poop2.png";}
     else{poop.image = "poop/poop3.png";}}
  else if (poops > 2) {
    petnaughty++;
     if (seconds % 2 == 0){poop.image = "poop/poop4.png";}
     else{poop.image = "poop/poop5.png";}}
  
  }else if (userActivity.adjusted.steps >= goals.steps) {poop.image = "poop/gameover.png";}
  else {poop.image = "blank.png";}

 //Reset stats at midnight
if ((util.zeroPad(hours) == 0)&& (minutes == 1)){
  petnaughty = 0;
  poops = 0;
  basic = 0;
}
  
  
  //Show large text Clock if clicked
button1.onclick = function(evt) { buttonnumber++; }

  if (buttonnumber == 1){
                    distancelabel.class = "labelseeblue";
                    firelabel.class  = "labelseeblue";
                    boltlabel.class  = "labelseeblue";
                    heartlabel.class  = "labelseeblue";
                    stairslabel.class  = "labelseeblue";
                    myLabel.class =  "showbigLabel";
                    date.class = "labelbigyellow"; 
                    ampm.class = "showbigampm"; 
                    evolution.class = "none";
                    basic++;
                    
                      if (seconds % 2 == 0){object.image = "read.jpeg";}
                      else{object.image = "read1.jpeg";}
  }else{
                    buttonnumber = 0;
                    distancelabel.class = "none";
                    firelabel.class  = "none";
                    boltlabel.class  = "none";
                    heartlabel.class  = "none";
                    stairslabel.class  = "none";
                    object.image = "blank.png";
                    myLabel.class =  "showLabel";
                    date.class = "labelyellow"; 
                    ampm.class = "ampm"; 
                    evolution.class = "meter";
    
  }
  
  //--------------CHANGE PET FORM IN FOREGROUND ------------------
  
    //----------Pet Evolution Egg -------------------
  if (userActivity.adjusted.steps < goals.steps/5){
     if (seconds % 2 == 0){pet.image = "pet/pet0animate0.png";}
     else{pet.image = "pet/pet0animate1.png";}
  }
  
    //----------Pet Evolution Baby Pet -------------------
  
  else if ((userActivity.adjusted.steps < ((goals.steps)*2)/5) && (userActivity.adjusted.steps > ((goals.steps*1)/5))) {
         if (seconds % 2 == 0){pet.image = "pet/babysmall1.png";}
         else{pet.image = "pet/babysmall2.png";}
  }
  
  //----------Pet Evolution Mini Pet -------------------
  
  else if ((userActivity.adjusted.steps < ((goals.steps)*3)/5)&& (userActivity.adjusted.steps > ((goals.steps*2)/5))){
         
         if (basic > 100){
         if (petnaughty > 100){
         if (seconds % 2 == 0){pet.image = "pet/pet2v0a0.png";}
         else{pet.image = "pet/pet2v0a1.png";}}
         else{
         if (seconds % 2 == 0){pet.image = "pet/pet2v1a0.png";}
         else{pet.image = "pet/pet2v1a1.png";}}
         }else{
                  if (petnaughty > 100){
                        if (seconds % 2 == 0){pet.image = "pet/pet2v3a0.png";}
                        else{pet.image = "pet/pet2v3a1.png";}}
                  else{
                        if (seconds % 2 == 0){pet.image = "pet/pet2v2a0.png";}
                        else{pet.image = "pet/pet2v2a1.png";}}
         }
         
  }
  
    //----------Pet Evolution Cup Pet -------------------
  
  else if ((userActivity.adjusted.steps < ((goals.steps)*4)/5)&& (userActivity.adjusted.steps > ((goals.steps*3)/5)))
           {
 if (basic > 200){
         if (petnaughty > 100){
         if (seconds % 2 == 0){pet.image = "pet/pet3v4a0.png";}          
         else{pet.image = "pet/pet3v4a1.png";}}
         else if (petnaughty > 200){
         if (seconds % 2 == 0){pet.image = "pet/pet3v0a0.png";}
         else{pet.image = "pet/pet3v0a1.png";}}
         else{
         if (seconds % 2 == 0){pet.image = "pet/pet3v1a0.png";}
         else{pet.image = "pet/pet3v1a1.png";}}
         }else{
                  if (petnaughty > 200){
                        if (seconds % 2 == 0){pet.image = "pet/pet3v3a0.png";}
                        else{pet.image = "pet/pet3v3a1.png";}}
                  else{
                        if (seconds % 2 == 0){pet.image = "pet/pet3v2a0.png";}
                        else{pet.image = "pet/pet3v2a1.png";}}
         }
           }
  
    //----------Pet Evolution Adult Pet -------------------
  
  else if ((userActivity.adjusted.steps < goals.steps)&& (userActivity.adjusted.steps > ((goals.steps*4)/5)))
           {
         if (basic > 400){
         if (petnaughty > 400){
         if (seconds % 2 == 0){pet.image = "pet/pet4v0a0.png";}
         else{pet.image = "pet/pet4v0a1.png";}}
         else{
         if (seconds % 2 == 0){pet.image = "pet/pet4v1a0.png";}
         else{pet.image = "pet/pet4v1a1.png";}}
         }else{
                  if (petnaughty > 400){
                        if (seconds % 2 == 0){pet.image = "pet/pet4v2a0.png";}
                        else{pet.image = "pet/pet4v2a1.png";}}
                  else{
                        if (seconds % 2 == 0){pet.image = "pet/pet4v3a0.png";}
                        else{pet.image = "pet/pet4v3a1.png";}}
         }
           }
  //---------Game Over Pet ------------------
  
  else if (userActivity.adjusted.steps > goals.steps){
    
    if (petnaughty > 500){
            if (seconds % 2 == 0){pet.image = "pet/ghostv2a0.png";}
            else{pet.image = "pet/ghostv2a1.png";}}
    else if (basic < 500){
             if (seconds % 2 == 0){pet.image = "pet/ghostv3a0.png";}
            else{pet.image = "pet/ghostv3a1.png";}     
    }
    //Perfect Pet Ending:                     
    else{
            if (seconds % 2 == 0){pet.image = "pet/ghostv1a0.png";}
            else{pet.image = "pet/ghostv1a1.png";}}
    
  } else {     if (seconds % 2 == 0){pet.image = "pet/pet1animate0.png";}
     else{pet.image = "pet/pet1animate1.png";}}
  
  
  if (userActivity.adjusted.steps < goals.steps/5){evolution.text = "???";}
  else if ((userActivity.adjusted.steps < ((goals.steps)*2)/5) && (userActivity.adjusted.steps > ((goals.steps*1)/5))) {evolution.text = "??????";}
  else if ((userActivity.adjusted.steps < ((goals.steps)*3)/5)&& (userActivity.adjusted.steps > ((goals.steps*2)/5)))
  {evolution.text = "?????????";}
  else if ((userActivity.adjusted.steps < ((goals.steps)*4)/5)&& (userActivity.adjusted.steps > ((goals.steps*3)/5)))
           {evolution.text = "????????????";}
  else if ((userActivity.adjusted.steps < goals.steps)&& (userActivity.adjusted.steps > ((goals.steps*4)/5)))
           {evolution.text = "???????????????";}
  else if (userActivity.adjusted.steps > goals.steps){evolution.text = "??????????????????";}
  else {evolution.text = "";}

 
  
   /*--- OPTION 2: TIME IMAGES FOR 12 HOUR CLOCK---*/
  //set class of each # IMAGE individually if needed for formatting
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  }else {hours = util.zeroPad(hours);}
  myLabel.text = `${hours}:${mins}`; 
  /*----------------------------SHOW CLOCK END----------------------------------*/                      

/*
  /*--- Battery Functions ---*/
  display.addEventListener('change', function () { if (this.on) {checkAndUpdateBatteryLevel();}
                                             
});
/*----------------------------END OF ON TICK-----------------------------------*/
  
/*----------------------------START OF FUNCTIONS--------------------------------*/

 /*--- Change Battery RED , GREEN & CHARGE ---*/  

function checkAndUpdateBatteryLevel() {
  batteryLabel.text = `${battery.chargeLevel}%`;
  if (battery.chargeLevel > 30){ batteryLabel.class = "labelgreen";}
  else {batteryLabel.class = "labelred";
        battery.onchange = (charger, evt) => {batteryLabel.class = "labelgreen";}}
}
 
  
  
/*--- Change Date and Background Functions ---*/

  function updateScene() {

   date.text = " " + daytext + " " + monthtext + " " + dates + " " + years + " ";  
  if (months == 0){monthtext = "January";}
  else if (months == 1){monthtext =  "February";}
  else if (months == 2){monthtext =  "March";}
  else if (months == 3){monthtext =  "April";}
  else if (months == 4){monthtext =  "May";}
  else if (months == 5){monthtext =  "June";}
  else if (months == 6){monthtext =  "July";}
  else if (months == 7){monthtext =  "August";}
  else if (months == 8){monthtext =  "Septemper";}
  else if (months == 9){monthtext =  "October";}
  else if (months == 10){monthtext = "November";}
  else if (months == 11){monthtext = "December";}
  else {monthtext = "MONTH";}
    
  if (days == 0){daytext =      "Sunday,";}
  else if (days == 1){daytext = "Monday,";}
  else if (days == 2){daytext = "Tuesday,";}
  else if (days == 3){daytext = "Wednesday,";}
  else if (days == 4){daytext = "Thursday,";}
  else if (days == 5){daytext = "Friday,";}
  else if (days == 6){daytext = "Saturday,";}
  else {daytext = "DAY";}
 }

}
/*----------------------------END OF FUNCTIONS--------------------------------*/
/*-------------------------------END OF CODE----------------------------------*/
