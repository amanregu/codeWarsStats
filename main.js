document.getElementById('fetch-button').addEventListener('click', getData);

// To Update Profile Card
var profileName = document.getElementById('profile-name')
var profileHonor = document.getElementById('profile-honor')
var profileClan = document.getElementById('profile-clan')

var finalArr = []
var label = []
var value = []
var kyuChart
var honors = {
  "8 kyu" : 2,
  "7 kyu" : 2**2,
  "6 kyu" : 2**3,
  "5 kyu" : 2**4,
  "4 kyu" : 2**5,
  "3 kyu" : 2**6,
  "2 kyu" : 2**7,
  "1 kyu" : 2**8
};

var daysArr = [];

function spinner(status) {
let spinner = document.getElementById('spinner');
 if (status) {
  spinner.style.display = 'flex';
 } else {
  spinner.style.display = 'none';
 }
}



async function getData() {
  spinner(true);
  console.log("Sending one request per kata to codewars API, this might take some time.")
  var username = document.getElementById('input-data').value
  let proxyUrl = 'https://cors-anywhere.herokuapp.com/'
  let profileUrl = `https://www.codewars.com/api/v1/users/${username}`
  let profileInfo = await fetch(proxyUrl + profileUrl)
  let jsonProfileInfo = await profileInfo.json()
  let profileData = await jsonProfileInfo
  profileName.innerText = profileData.username
  profileHonor.innerText = "Honor:" + profileData.honor
  profileClan.innerText = "Clan:" + profileData.clan
  let mainresponceUrl = `https://www.codewars.com/api/v1/users/${username}/code-challenges/completed?page=0`
  let mainresponce = await fetch(proxyUrl + mainresponceUrl)
  let data12 = await mainresponce.json()
   for(let i =0;i<data12.data.length;i++) {
    let responceUrl = `https://www.codewars.com/api/v1/code-challenges/${data12.data[i].id}`
    let response = await fetch(proxyUrl + responceUrl)
    let jsonresponce = await response.json()
    data12.data[i].points = jsonresponce.rank.name
    await reduceData(data12.data)
    
  }
  return data12
}

 function reduceData(katas) {
 finalArr = katas.reduce((acc,cv)=>{
    const date = cv.completedAt.split('T')[0]
    if (date in acc) {
      acc[date] +=  honors[cv.points]
    } else {
      acc[date] = honors[cv.points]
    }
    return acc;

  }, {})
  label = Object.keys(finalArr).reverse()
  value = Object.values(finalArr).reverse()

  if (!value.includes(NaN)) {
  renderChart(label,value)
  } 
}
function renderChart(label,value) {
  spinner(false)
  if (kyuChart) {
    kyuChart.destroy();
  }
  var data = {
    labels: label,
    datasets: [{
      label: "Kyu V/S Date",
      backgroundColor: "rgba(255,165,0,0.2)",
      borderColor: "rgba(255,99,132,1)",
      borderWidth: 2,
      hoverBackgroundColor: "rgba(255,99,132,0.4)",
      hoverBorderColor: "rgba(255,99,132,1)",
      data: value,
    }]
  };

  var options = {
    maintainAspectRatio: false,
    scales: {
      yAxes: [{
        stacked: true,
        gridLines: {
          display: true,
          color: "rgba(255,165,0,0.2)"
        }
      }],
      xAxes: [{
        gridLines: {
          display: false
        }
      }]
    }
  };
  
  kyuChart = Chart.Line('chart', {
    options: options,
    data: data
  });
}