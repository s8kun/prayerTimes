const tableArray = document.querySelectorAll(".table-array");  
const prayerArray = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

fetch('http://ip-api.com/json/')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    let city = data.city;
    let country = data.countryCode;
    let lat = data.lat; 
    let lon = data.lon;

    console.log(`Latitude: ${lat}, Longitude: ${lon}`); // Debugging log
    document.getElementById("city").innerHTML = `${city}, ${country}`;

    // جلب أوقات الصلاة
    fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=2`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(dataTime => {
        if (dataTime.data && dataTime.data.timings) {
          let timings = dataTime.data.timings;

          // تحديث الجدول بأوقات الصلاة 
          prayerArray.forEach((prayer, index) => {
            if (tableArray[index]) {
              let prayerTime = timings[prayer]; 
              let [hour, minute] = prayerTime.split(":").map(num => parseInt(num)); 

              let period = "AM";
              if (hour >= 12) {
                period = "PM";
                if (hour > 12) hour -= 12; 
              } else if (hour === 0) {
                hour = 12; 
              }

              tableArray[index].innerText = `${hour}:${minute.toString().padStart(2, "0")} ${period}`;  
            }
          });
        } else {
          console.error("Invalid response from Aladhan API", dataTime);
        }
      })
      .catch(error => console.error("Error fetching prayer times:", error));
  })
  .catch(error => console.error("Error fetching location data:", error));