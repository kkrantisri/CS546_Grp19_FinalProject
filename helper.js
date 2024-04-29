import { ObjectId } from 'mongodb';


const exportedMethods = {
  checkId(id, varName) {
    if (!id) throw `Error: You must provide a ${varName}`;
    if (typeof id !== 'string') throw `Error:${varName} must be a string`;
    id = id.trim();
    if (id.length === 0)
      throw `Error: ${varName} cannot be an empty string or just spaces`;
    if (!ObjectId.isValid(id)) throw `Error: ${varName} invalid object ID`;
    return id;
  },
  checkString(strVal, varName) {
    if (!strVal) throw `Error: You must supply a ${varName}!`;
    if (typeof strVal !== 'string') throw `Error: ${varName} must be a string!`;
    strVal = strVal.trim();
    if (strVal.length === 0)
      throw `Error: ${varName} cannot be an empty string or string with just spaces`;
    if (!isNaN(strVal))
      throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;
    return strVal;
  },
  checkStringArray(arr, varName) {
    //We will allow an empty array for this,
    //if it's not empty, we will make sure all tags are strings
    if (!arr || !Array.isArray(arr))
      throw `You must provide an array of ${varName}`;
    for (let i in arr) {
      if (typeof arr[i] !== 'string' || arr[i].trim().length === 0) {
        throw `One or more elements in ${varName} array is not a string or is an empty string`;
      }
      arr[i] = arr[i].trim();
    }

    return arr;
  },
  checkEmail(email) {
    const emailRegex = /^[a-zA-Z]+@stevens\.edu$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email address. Email must be in the format username@stevens.edu and contain only alphabetic characters before @.');
    }
    email = email.toLowerCase();

    return email;
  },
  checkRating(rating) {
    const parsedRating = parseFloat(rating);
    if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      throw new Error('Invalid rating. Rating must be a number between 1 and 5.');
    }
    return parsedRating;
  },
  isValidDate(dateString) {
  
    var regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;
    if (!regex.test(dateString)) {
        return false;
    }
    
    var dateParts = dateString.split('/');
    var month = parseInt(dateParts[0], 10);
    var day = parseInt(dateParts[1], 10);
    var year = parseInt(dateParts[2], 10);
    var date = new Date(year, month - 1, day);
    if(day===29 && month===2){
      return false;
    }
    var currentdate = new Date();

    if(date < currentdate)
    {
    
       return false;
    }
    return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
    );
  },
  isTimeSlotValid(selectedTimeSlot) {
    
    var selectedStartTime = selectedTimeSlot.split(" - ")[0];
    var selectedEndTime = selectedTimeSlot.split(" - ")[1];

    
    var currentDate = new Date();
    var currentHour = currentDate.getHours();
    var currentMinutes = currentDate.getMinutes();

    
    var currentTime = currentHour + ":" + currentMinutes;
    
    
    if (selectedStartTime > currentTime) {
        return true;
    } else {
        return false;
    }
}

};
export default exportedMethods;