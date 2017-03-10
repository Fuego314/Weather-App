'use strict';

$(function () {

	var weatherURL = {
		urlStart: 'https://api.wunderground.com/api/483288b13597dd87/conditions/forecast10day/q/',
		userLat: '',
		userLon: '',
		format: '.json'
	};

	navigator.geolocation.getCurrentPosition(function (position) {
		weatherURL.userLat = position.coords.latitude;
		weatherURL.userLon = position.coords.longitude;
		getWeather();
	});

	function getWeather() {
		$.ajax({
			type: 'GET',
			url: weatherURL.urlStart + weatherURL.userLat + ',' + weatherURL.userLon + weatherURL.format,
			dataType: 'json',
			success: function success(data) {
				var currentTemp = Math.round(data.current_observation.temp_c);

				$('#temp').html(currentTemp + '&deg;C');
				$('.location').html(data.current_observation.display_location.city + ', ' + data.current_observation.display_location.country);
				$('.detail').html(data.current_observation.weather);

				for (var i = 0; i < 5; i++) {
					$('.forecast-deg:eq(' + i + ')').html(Math.round(data.forecast.simpleforecast.forecastday[i].high.celsius) + '&deg;C');
				}

				// Convert C to F
				$('.temp-switch-checkbox').change(function () {
					$(this).is(':checked') ? $("#temp").html(currentTemp + '&deg;C') : $("#temp").html(Math.round(currentTemp * 9 / 5 + 32) + '&deg;F');
					for (var _i = 0; _i < 5; _i++) {
						var castDeg = Math.round(data.forecast.simpleforecast.forecastday[_i].high.celsius);
						$(this).is(':checked') ? $('.forecast-deg:eq(' + _i + ')').html(castDeg + '&deg;C') : $('.forecast-deg:eq(' + _i + ')').html(Math.round(castDeg * 9 / 5 + 32) + '&deg;F');
					}
				});

				// Add class to show weather forecast icon
				var iconSet = ['clear-sun', 'cloudy', 'flurries-sleet', 'fog-hazy', 'm-cloud-p-sun', 'm-sun-p-cloud', 'snow', 'rain', 'tstorms', 'flurries-sleet-chance', 'rain-chance', 'snow-chance', 'tstorms-chance', 'unknown'];
				for (var _i2 = 0; _i2 < 5; _i2++) {
					var icon = $('.forecast-icon:eq(' + _i2 + ')'),
					    iconName = data.forecast.simpleforecast.forecastday[_i2].icon;
					switch (iconName) {
						case 'clear' || 'sunny':
							icon.addClass(iconSet[0]);
							break;
						case 'cloud':
							icon.addClass(iconSet[1]);
							break;
						case 'flurries' || 'sleet':
							icon.addClass(iconSet[2]);
							break;
						case 'fog' || 'hazy':
							icon.addClass(iconSet[3]);
							break;
						case 'mostlycloudy' || 'partlysunny':
							icon.addClass(iconSet[4]);
							break;
						case 'partlycloudy' || 'mostlysunny':
							icon.addClass(iconSet[5]);
							break;
						case 'sun':
							icon.addClass(iconSet[6]);
							break;
						case 'rain':
							icon.addClass(iconSet[7]);
							break;
						case 'tstorms':
							icon.addClass(iconSet[8]);
							break;
						case 'chanceflurries' || 'chancesleet':
							icon.addClass(iconSet[9]);
							break;
						case 'chancerain':
							icon.addClass(iconSet[10]);
							break;
						case 'chancetstorms':
							icon.addClass(iconSet[11]);
							break;
						default:
							icon.addClass(iconSet[12]);
					}
				}
				console.log(currentTemp);
				// Change background depending on temp
				if (currentTemp <= -3) {
					$('body').addClass('coldest-bg');
				} else if (currentTemp < 1) {
					$('body').addClass('cold-bg');
				} else if (currentTemp < 4) {
					$('body').addClass('chilly-bg');
				} else if (currentTemp < 7) {
					$('body').addClass('gloomy-bg');
					console.log('1');
				} else if (currentTemp < 10) {
					$('body').addClass('cool-bg');
				} else if (currentTemp < 13) {
					$('body').addClass('clear-bg');
				} else if (currentTemp < 16) {
					$('body').addClass('warm-bg');
				} else if (currentTemp <= 20) {
					$('body').addClass('hot-bg');
				} else if (currentTemp >= 21) {
					$('body').addClass('hottest-bg');
				}
				getWelcome();
			},
			error: function error(xhr, status, _error) {
				$('.welcome').html('We are sorry, there has been an error. Please try again later');
			}
		});
	}

	// Get welcoming header
	var getWelcome = function getWelcome() {
		var currentTime = new Date(),
		    hours = currentTime.getHours().toString(),
		    minutes = currentTime.getMinutes().toString(),
		    fixedMins = void 0,
		    hrsNmins = void 0,
		    checker = void 0;

		// If minutes under 10 add 0 to keep time in correct format
		minutes < 10 ? fixedMins = 0 + minutes : fixedMins = minutes;

		hrsNmins = hours + fixedMins;
		checker = parseInt(hrsNmins);

		if (checker > 2100 || checker < 500) {
			$('body').addClass('night-bg');
		}

		if (checker >= 500 && checker <= 930) {
			$("#dynamic-welcome").html("Rise and Shine");
		} else if (checker > 930 && checker < 1200) {
			$("#dynamic-welcome").html("Good Morning");
		} else if (checker >= 1200 && checker < 1700) {
			$("#dynamic-welcome").html("Good Afternoon");
		} else if (checker >= 1700 && checker < 2100) {
			$("#dynamic-welcome").html("Good Evening");
		} else if (checker >= 2100 || checker >= 0 && hrsNmins <= 59) {
			$(".welcome").html("Having a Nice Night?");
		} else if (checker >= 100 && checker < 500) {
			$("#dynamic-welcome").html("You Should Be Asleep!");
		}
	};

	// Get next 5 days names
	(function () {
		// Create an array storing day names
		var DayAsString = function DayAsString(dayIndex) {
			var weekdays = new Array(7);
			weekdays[0] = "Sun";
			weekdays[1] = "Mon";
			weekdays[2] = "Tue";
			weekdays[3] = "Wed";
			weekdays[4] = "Thu";
			weekdays[5] = "Fri";
			weekdays[6] = "Sat";
			return weekdays[dayIndex];
		};
		// Get days for forecast
		var GetDates = function GetDates(startDate, daysToAdd) {
			var aryDates = [];
			for (var i = 0; i <= daysToAdd; i++) {
				var currentDate = new Date();

				currentDate.setDate(startDate.getDate() + i);
				aryDates.push(DayAsString(currentDate.getDay()));
			}
			return aryDates;
		};
		// Finish off by adding the day name to forecast
		var startDate = new Date(),
		    aryDates = GetDates(startDate, 5);

		for (var i = 0; i < 5; i++) {
			$('.day:eq(' + i + ')').html(aryDates[i + 1]);
		}
	})();

	setTimeout(function () {
		$('.weather').css('opacity', '1');
	}, 1800);

	$('.overlay-btn').click(function () {
		$('.overlay').css({ 'opacity': '0', 'z-index': '0' });
		$('.weather').css('overflow', 'visible');
	});

	setInterval(function () {
		var heightNow = $(window).outerHeight(true);
		$('body').css('height', heightNow + 'px');
	}, 100);
});