import moment from "moment";

function ROUNDTO(value, precision) {
  var multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}

function TRUNCATESTRING(str, num) {
  if (str.length > num) {
    return str.length > 6
      ? str.slice(0, num - 3) + "..."
      : str.slice(0, num) + "...";
  } else {
    return str;
  }
}

function FORMATNUMBERWITHCOMMA(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function VALIDATE_EMAIL(email) {
  const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,6}$/;
  return pattern.test(email);
}

function FORMAT_DATE_MEMBER_SINCE(date) {
  const dt = new Date(date);
  const monthArr = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return `${monthArr[dt.getMonth()]} ${dt.getFullYear()}`;
}

function FORMAT_DATE_SLASH(date) {
  const dt = new Date(date);
  let showMnth =
    dt.getMonth() < 10 ? `0${dt.getMonth() + 1}` : `${dt.getMonth + 1}`;

  return `${
    dt.getDate() < 10 ? "0" + dt.getDate() : dt.getDate()
  }/${showMnth}/${dt.getFullYear()}`;
}

function FORMAT_TIME_STRING_12H(time) {
  if (time) {
    // Check correct time format and split into components
    time = time
      .toString()
      .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) {
      // If time format correct
      time = time.slice(1); // Remove full string match value
      time[5] = +time[0] < 12 ? " AM" : " PM"; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
      time[0] = String(time[0]).padStart(2, "0");
    }
    return time.join(""); // return adjusted time or original string
  }
}

function CHECK_WITHIN_WORKTIME(targetTime, timeFrom, timeTo) {
  const dt = new Date();
  let showMnth =
    dt.getMonth() < 9 ? `0${dt.getMonth() + 1}` : `${dt.getMonth + 1}`;

  let tgDate = `${dt.getFullYear()}-${showMnth}-${dt.getDate()} ${targetTime}`;
  let fromDate = `${dt.getFullYear()}-${showMnth}-${dt.getDate()} ${timeFrom}`;
  let toDate = `${dt.getFullYear()}-${showMnth}-${dt.getDate()} ${timeTo}`;

  return moment(tgDate).isBetween(fromDate, toDate);
}

function LOAD_PROFILE_THUMBNAIL(targetUrl) {
  return targetUrl
    ? { uri: targetUrl }
    : require("../../assets/photos/no-profile.png");
}

function LOAD_SERVICE_THUMBNAIL(targetUrl) {
  return targetUrl
    ? { uri: `${targetUrl}` }
    : require("../../assets/photos/no-service.png");
}

function ConvertToISOFormat(datetimeStr) {
  // Split date and time
  const [datePart, timePart] = datetimeStr.split(" ");

  // Split the date into day, month, and year
  let [day, month, year] = datePart.split("-");

  // Split the time into hours, minutes, and seconds
  let [hours, minutes, seconds] = timePart.split(":");

  // Add leading zeros to day, month, hours, and minutes if needed
  day = day.padStart(2, "0");
  month = month.padStart(2, "0");
  hours = hours.padStart(2, "0");
  minutes = minutes.padStart(2, "0");

  // Construct the final ISO format datetime string
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
}

function FORMAT_TIME_LAST_SEEN(targetTime) {
  targetTime = ConvertToISOFormat(targetTime);
  var dt = new Date(targetTime);
  var seconds = Math.floor((new Date() - dt) / 1000);

  var interval;

  interval = seconds / 86400;
  if (interval > 1) {
    if (interval >= 2) {
      return `${String(dt.getDate()).padStart(2, "0")}/${String(
        dt.getMonth() + 1
      ).padStart(2, "0")}/${dt.getFullYear()}`;
    }
    return "Yesterday";
  }

  interval = seconds / 3600;
  if (interval > 1) {
    return "Last seen " + Math.floor(interval) + "h ago";
  }

  interval = seconds / 60;
  if (interval > 1) {
    return "Last seen " + Math.floor(interval) + "m ago";
  }

  return "Last seen " + Math.floor(seconds) + "s ago";
}

function FORMAT_TIME_AGO(targetTime) {
  setTimeout(() => {
    FORMAT_TIME_AGO(targetTime);
  }, 10000);

  var dt = new Date(targetTime);
  var seconds = Math.floor((new Date() - dt) / 1000);

  var interval;

  interval = seconds / 86400;
  if (interval > 1) {
    if (interval >= 2) {
      return `${String(dt.getDate()).padStart(2, "0")}/${String(
        dt.getMonth() + 1
      ).padStart(2, "0")}/${dt.getFullYear()}`;
    }
    return "Yesterday";
  }

  interval = seconds / 3600;
  if (interval > 1) {
    if (interval >= 2) {
      return Math.floor(interval) + " hours ago";
    }
    return Math.floor(interval) + " hour ago";
  }

  interval = seconds / 60;
  if (interval > 1) {
    if (interval >= 2) {
      return Math.floor(interval) + " minutes ago";
    }
    return Math.floor(interval) + " minute ago";
  }

  return Math.floor(seconds) + " seconds ago";
}

function CHECK_IS_ONLINE(lastSeen) {
  lastSeen = ConvertToISOFormat(lastSeen);
  var dt = new Date(lastSeen);
  var seconds = Math.floor((new Date() - dt) / 1000);

  interval = seconds / 60;

  if (interval >= 3) {
    return false;
  } else {
    return true;
  }
}

function FORMAT_CHAT_TIME(targetTime) {
  var dt = new Date(targetTime);
  var seconds = Math.floor((new Date() - dt) / 1000);

  var interval;

  var fullTime = `${String(dt.getHours()).padStart(2, "0")}:${String(
    dt.getMinutes()
  ).padStart(2, "0")}`;

  interval = seconds / 3600;
  if (interval > 1) {
    return `${FORMAT_TIME_STRING_12H(fullTime)}`;
  }

  return "Just now";
}

function GENERATE_RANDOM_NUMBER(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function GENERATE_CURRENT_GREETING() {
  let dt = new Date();
  let hour = dt.getHours();

  if (hour >= 0 && hour < 12) {
    return "Good morning";
  }

  if (hour > 12 && hour < 16) {
    return "Good afternoon";
  }

  return "Good evening";
}

export {
  ROUNDTO,
  TRUNCATESTRING,
  FORMATNUMBERWITHCOMMA,
  VALIDATE_EMAIL,
  FORMAT_DATE_MEMBER_SINCE,
  FORMAT_DATE_SLASH,
  FORMAT_TIME_STRING_12H,
  CHECK_WITHIN_WORKTIME,
  LOAD_PROFILE_THUMBNAIL,
  LOAD_SERVICE_THUMBNAIL,
  FORMAT_TIME_AGO,
  FORMAT_TIME_LAST_SEEN,
  CHECK_IS_ONLINE,
  FORMAT_CHAT_TIME,
  GENERATE_RANDOM_NUMBER,
  GENERATE_CURRENT_GREETING,
};
