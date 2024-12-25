# JS Simple Calendar with Holiday

A simple calendar with holiday, using Indonesian national holiday as holiday data source. Built using plain JavaScript & basic HTML/CSS.

## Data source

> [!NOTE]
> The project holiday data may need to be improved based on realtime holiday data. Otherwise, this project can be improved by fetch comperhensive holiday data without requiring API key or fetch holiday data for each month.

If you access this site normally without any parameters on URL, the holiday data are provided from GitHub project [guangrei/APIHariLibur_V2](https://github.com/guangrei/APIHariLibur_V2):

```
https://raw.githubusercontent.com/guangrei/APIHariLibur_V2/main/holidays.json
```

Otherwise, if you access with `googleApiKey` parameter after site URL, you will able to access holiday data from years before and after this year.

### Accessing Holiday Data from Google Calendar

Because accessing holiday data from stored API key in GitHub is strictly prohibited, you'll need to manually set your Google Calendar API key from your own & put it over the site's parameter as follow:

```
https://akmalrusli363.github.io/js-simple-calendar-holiday?googleApiKey={YOUR_GOOGLE_CALENDAR_API_KEY}
```

In order to access holiday data from Google Calendar, the base URL of Google Calendar described from `index.js` as follow:

```js
const getHolidayRemoteDataSourceUrl = () => {
  const baseUrl = 'https://www.googleapis.com/calendar/v3/calendars'
  const locale = 'id.indonesian'
  const calendarId = 'holiday@group.v.calendar.google.com'
  const apiKey = '{YOUR_GOOGLE_CALENDAR_API_KEY}'
  return `${baseUrl}/${locale}%23${calendarId}/events?key=${apiKey}`
}
```

1. `baseUrl`: Provides base URL of Google Calendar API
2. `locale`: The language & region of holiday calendar
3. `calendarId`: The calendar metadata source
4. `apiKey`: Required to obtain holiday data from Google Calendar API. Ratelimits may apply for `apiKey`

## Image source

By default, image source are provided from [picsum.photos](picsum.photos). By default in this project, the image provided from:

```
https://picsum.photos/seed/{YEAR}-{MONTH}/{width}/{height}
```

For example in December 2024, the generated image URL was `https://picsum.photos/seed/2024-12/640/640`, with both `width` and `height` are 640 pixels. Let me generate the image below:

![Picsum photo of December 2024 (2024-12)](https://picsum.photos/seed/2024-12/320/320 "Picsum photo of December 2024 (2024-12)")

The preview image size was reduced to 320x320 pixel for the `README.md` documentation. As generated from seed, the generated photo fills the calendar image preview size depends on device size & orientation.
