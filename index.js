let date = new Date()
let year = date.getFullYear()
let month = date.getMonth()

const day = document.querySelector('.calendar-dates')
const currDate = document.querySelector('.calendar-current-date')
const holidayList = document.querySelector('.calendar-holidays-list')
const holidaySection = document.querySelector('.calendar-holidays')
const emptyHolidaySection = document.querySelector(
  '.calendar-empty-holiday-list'
)

const prevNextIcons = document.querySelectorAll('.calendar-navigation span')
const calendarImg = document.querySelector('.calendar-pictoral-img')
const urlParams = new URLSearchParams(window.location.search)

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

const fallbackHolidays = async () => {
  try {
    const response = await fetch(
      'https://raw.githubusercontent.com/guangrei/APIHariLibur_V2/main/holidays.json'
    )
    if (!response.ok) {
      throw new Error(
        `Unable to fetch holiday data from fallback calendar API! HTTP ${response.status}`
      )
    }
    const json = await response.json()
    return parseAsHolidayArray(json) || {}
  } catch (err) {
    console.error(err)
    return {}
  }
}

const holidays = async () => {
  try {
    const response = await fetch(getHolidayRemoteDataSourceUrl())
    if (!response.ok) {
      throw new Error(
        `Unable to fetch holiday data from Google Calendar API! HTTP ${response.status}`
      )
    }
    const json = await response.json()
    return parseGoogleHolidayData(json) || {}
  } catch (googleApiError) {
    console.error(googleApiError)
    return fallbackHolidays()
  }
}

const getHolidayRemoteDataSourceUrl = () => {
  const baseUrl = 'https://www.googleapis.com/calendar/v3/calendars'
  const locale = 'id.indonesian'
  const calendarId = 'holiday@group.v.calendar.google.com'
  const googleApiKey = urlParams.get('googleApiKey')
  return `${baseUrl}/${locale}%23${calendarId}/events?key=${googleApiKey}`
}

const parseGoogleHolidayData = (jsonHoliday) => {
  let holidays = {}
  let fetchedHolidays = jsonHoliday.items || []
  for (const holis of fetchedHolidays) {
    const eDate = holis.start.date
    const desc = holis.summary
    const isHoliday = holis.description == 'Hari libur nasional'

    let d = new Date(eDate)
    const year = d.getFullYear()
    const month = d.getMonth()
    const day = d.getDate()

    if (isHoliday) {
      holidays[year] = holidays[year] || {}
      holidays[year][month] = holidays[year][month] || {}
      holidays[year][month][day] = holidays[year][month][day] || []
      holidays[year][month][day].push(desc)
    }
  }
  return holidays
}

const parseAsHolidayArray = (jsonHoliday) => {
  let holidays = {}
  for (const date in jsonHoliday) {
    if (!isNaN(new Date(date))) {
      let d = new Date(date)

      const year = d.getFullYear()
      const month = d.getMonth()
      const day = d.getDate()

      holidays[year] = holidays[year] || {}
      holidays[year][month] = holidays[year][month] || {}
      holidays[year][month][day] = holidays[year][month][day] || []
      holidays[year][month][day].push(jsonHoliday[date].summary)
    }
  }
  return holidays
}

const toggleHolidayFieldVisibility = (visibility) => {
  if (visibility) {
    holidaySection.classList.remove('hidden')
    emptyHolidaySection.classList.add('hidden')
  } else {
    holidaySection.classList.add('hidden')
    emptyHolidaySection.classList.remove('hidden')
  }
}

const updateCalendar = (holidays) => {
  let firstDate = new Date(year, month, 1).getDay()
  let lastDate = new Date(year, month + 1, 0).getDate()
  let dayEnd = new Date(year, month, lastDate).getDay()
  let monthlastDate = new Date(year, month, 0).getDate()

  // Variable to store the generated calendar HTML
  let dateTable = ''

  // Loop to add the last dates of the previous month
  for (let i = firstDate; i > 0; i--) {
    dateTable += `<li class="inactive">${monthlastDate - i + 1}</li>`
  }

  // Loop to add the dates of the current month
  for (let i = 1; i <= lastDate; i++) {
    let isToday =
      i === date.getDate() &&
      month === new Date().getMonth() &&
      year === new Date().getFullYear()
        ? 'active'
        : ''
    let isHoliday =
      holidays[year] &&
      holidays[year][month] &&
      holidays[year][month][i] != null
        ? 'holiday'
        : ''
    dateTable += `<li class="${isToday} ${isHoliday}">${i}</li>`
  }

  // Loop to add the first dates of the next month
  for (let i = dayEnd; i < 6; i++) {
    dateTable += `<li class="inactive">${i - dayEnd + 1}</li>`
  }

  currDate.innerText = `${months[month]} ${year}`
  document.title = `Calendar - ${months[month]} ${year}`
  day.innerHTML = dateTable

  let holidayListTxt = ''
  let hasHoliday = holidays[year] && holidays[year][month] != null
  toggleHolidayFieldVisibility(hasHoliday)

  if (hasHoliday) {
    for (let holiday in holidays[year][month]) {
      for (let holi of holidays[year][month][holiday]) {
        holidayListTxt += `<li><span class="calendar-holidays-date">${holiday}</span>: ${holi}</li>`
      }
    }
  }
  holidayList.innerHTML = holidayListTxt
}

const loadCalendarImage = () => {
  const colorThief = new ColorThief()

  calendarImg.src = `src/placeholder-blur.jpg`
  calendarImg.style.filter = `blur(5px)`

  const loadImage = (src) =>
    new Promise((resolve, reject) => {
      calendarImg.onload = () => resolve(calendarImg)
      calendarImg.onerror = reject
      calendarImg.src = src
      calendarImg.crossOrigin = 'anonymous'
    })

  loadImage(`https://picsum.photos/seed/${year}-${month + 1}/640/640`)
    .then((image) => {
      calendarImg.style.filter = ``
      const dominantColor = colorThief.getColor(calendarImg)
      document.body.style.background = `rgb(${dominantColor.join(', ')})`
    })
    .catch((reason) => {
      console.error(reason)
    })
}

const changeMonth = (holidayData, isPreviousMonth) => {
  month = isPreviousMonth ? month - 1 : month + 1

  if (month < 0 || month > 11) {
    date = new Date(year, month, new Date().getDate())
    year = date.getFullYear()
    month = date.getMonth()
  } else {
    date = new Date()
  }

  updateCalendar(holidayData)
  loadCalendarImage()
}

holidays().then((holidayData) => {
  updateCalendar(holidayData)
  loadCalendarImage()

  prevNextIcons.forEach((icon) => {
    icon.addEventListener('click', () => {
      const buttonState = icon.id === 'calendar-prev'
      changeMonth(holidayData, buttonState)
    })
  })

  document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      changeMonth(holidayData, true)
    } else if (event.key === 'ArrowRight') {
      changeMonth(holidayData, false)
    }
  })
})
