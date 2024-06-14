let userCityCoords;
let destinationCityCoords;

document.addEventListener('DOMContentLoaded', () => {
    const fetchCityInfoButton = document.getElementById('fetchCityInfo');
    const fetchDestinationInfoButton = document.getElementById('fetchDestinationInfo'); // 使用 const 声明

    const form = document.querySelector('.form--login');
    var calculateButton = document.getElementById('search-button');
    calculateButton.addEventListener('click', function() {
      // 跳转到"http://localhost:3000/search"页面
      window.location.href = 'http://localhost:3000/search';
    });
    fetchCityInfoButton.addEventListener('click', function () {
        const userCity = document.getElementById('userCity').value;
        getCityCoordinates(userCity, (data) => {
            userCityCoords = { latitude: data.latitude, longitude: data.longitude };
            displayCityInfo(data);
            console.log("User City Coordinates: ", userCityCoords);  // 在这里打印
        });
    });

    fetchDestinationInfoButton.addEventListener('click', function () {
        const destinationCity = document.getElementById('destinationCity').value;
        console.log('Button clicked, requested city:', destinationCity);
        getDestinationCoordinates(destinationCity, () => {
            console.log("Destination City Coordinates: ", destinationCityCoords); // 确保在数据设置之后打印
        });
    });

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        if (userCityCoords && destinationCityCoords) {
            const distance = calculateDistance(
                userCityCoords.latitude, userCityCoords.longitude,
                destinationCityCoords.latitude, destinationCityCoords.longitude
            );
            showMessage(`The distance is ${distance.toFixed(2)} km.`);
        } else {
            showMessage("Please fetch both cities' information first.");
        }
    });
});

function getCityCoordinates(city, callback) {
    const apiKey = 'mfud0Z7InAmDL8p8Bz2Afg==ReaKgP2WOdLg4C7U';
    const apiUrl = `https://api.api-ninjas.com/v1/city?name=${encodeURIComponent(city)}`;

    fetch(apiUrl, {
        headers: {
            'X-Api-Key': apiKey
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`API responded with status ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.length > 0) {
            callback(data[0]);
        } else {
            updateCityInfoResult('City not found');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        updateCityInfoResult(`Error fetching data: ${error.message}`);
    });
}

function displayCityInfo(cityData) {
    // 构建要显示的信息字符串
    let info = `
        <strong>Name:</strong> ${cityData.name}<br>
        <strong>Coordinates:</strong> ${cityData.latitude}, ${cityData.longitude}<br>
        <strong>Country:</strong> ${cityData.country}<br>
        <strong>Population:</strong> ${cityData.population.toLocaleString()}<br>
        <strong>Capital:</strong> ${cityData.is_capital ? 'Yes' : 'No'}
    `;

    // 更新城市信息显示区域
    updateCityInfoResult(info);
}


function updateCityInfoResult(message) {
    const cityInfoResultElement = document.getElementById('cityInfoResult');
    cityInfoResultElement.innerHTML = message;
}


function getDestinationCoordinates(city, callback) {
    const url = `/api/destination-coordinates?city=${encodeURIComponent(city)}`;

    fetch(url)
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                throw new Error(`Error ${response.status}: ${text}`);
            });
        }
        return response.json();
    })
    .then(data => {
        if (data.status === 'success' && data.data.coordinates) {
            // 如果API返回的格式是 {longitude, latitude}，请确保这里调整为正确的顺序
            destinationCityCoords = { latitude: data.data.coordinates[1], longitude: data.data.coordinates[0] };
            console.log("Destination Coordinates: ", destinationCityCoords);
            displayDestinationInfo(data.data.coordinates);
            if (callback) callback();
        } else {
            updateDestinationInfoResult('City not found in the database');
        }
    })
    
    .catch(error => {
        console.error('Error:', error);
        updateDestinationInfoResult(`Error fetching data: ${error.message}`);
    });
}



function displayDestinationInfo(coordinates) {
    // Check if coordinates array has latitude and longitude
    if (coordinates && coordinates.length === 2) {
        let info = `Coordinates: ${coordinates[0]}, ${coordinates[1]}`;
        updateDestinationInfoResult(info);
    } else {
        updateDestinationInfoResult('Invalid coordinates data');
    }
}

function updateDestinationInfoResult(message) {
    const destinationInfoResultElement = document.getElementById('destinationInfoResult');
    destinationInfoResultElement.innerHTML = message;
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    function toRad(x) {
        return x * Math.PI / 180;
    }

    var R = 6371; // 地球半径，单位为千米
    var dLat = toRad(lat2 - lat1);
    var dLon = toRad(lon2 - lon1);
    var lat1Rad = toRad(lat1);
    var lat2Rad = toRad(lat2);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1Rad) * Math.cos(lat2Rad); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var distance = R * c;
    return distance;
}

// 新增显示消息的函数
function showMessage(message) {
    const messageBox = document.querySelector('.message-box');
    if (messageBox) {
        messageBox.textContent = message; // 更新文本内容
        messageBox.style.display = 'block'; // 显示元素
    }
}