// Edit event details here when the timings are confirmed.
export const wedding = {
  names: ["Henil Shah", "Vidhi Mehta"],
  dates: "1st & 2nd February 2027",
  venue: "Waves Club Resort",
  city: "Vadodara",
  directions: "https://maps.app.goo.gl/JrAsvJFHoJxJgzD98",
  // Drop your own files into public/media/ using these exact names.
  media: {
    music: "/media/a-thousand-years.mp3",
    chapterVideo: "/media/chapter-background.mp4",
    film: "/media/our-film.mp4",
  },
  mapEmbed:
    "https://maps.google.com/maps?q=Waves%20Club%20Vadodara%20%4022.2865618%2C73.1319254&z=16&output=embed",
  // Draft story copy; replace these with your actual memories/dates.
  story: [
    {
      date: null,
      title: "When our paths crossed",
      text: "The beginning of a story only we could write.",
      image: "/photo-1.jpg",
      alt: "Vidhi smiling",
    },
    {
      date: null,
      title: "All the little moments",
      text: "The laughter, the adventures, and the memories we hold close.",
      image: "/photo-2.jpg",
      alt: "Henil smiling",
    },
    {
      date: "2nd February 2027",
      title: "Our forever begins",
      text: "We can’t wait to celebrate our next chapter with you.",
      image: "/portrait.png",
      alt: "Henil and Vidhi together",
    },
  ],
  // Add up to 12 more entries here; place image files in public/gallery/.
  gallery: [
    {src:'/photo-1.jpg',alt:'Vidhi smiling'},
    {src:'/photo-2.jpg',alt:'Henil smiling'},
    {src:'/photo-3.jpg',alt:'Vidhi enjoying a day out'},
    {src:'/photo-4.jpg',alt:'Henil on a day out'},
  ],
  events: [
    {
      id: "haldi",
      title: "Haldi",
      number: "01",
      label: "THE GOLDEN BEGINNING",
      date: "1st February 2027",
      time: "To be announced",
      theme: "Sky blue colour",
      description:
        "A little turmeric, a lot of laughter, and a golden start to our celebrations.",
    },
    {
      id: "sangeet",
      title: "Sangeet",
      number: "02",
      label: "A NIGHT TO REMEMBER",
      date: "1st February 2027",
      time: "To be announced",
      description: "An evening of music, dancing, and celebrating together.",
    },
    {
      id: "wedding",
      title: "Wedding Ceremony",
      number: "03",
      label: "OUR FOREVER BEGINS",
      date: "2nd February 2027",
      time: "To be announced",
      description:
        "Join us as we begin our forever, surrounded by your love and blessings.",
    },
  ],
};
