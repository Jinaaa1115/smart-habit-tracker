let habits = JSON.parse(localStorage.getItem("habits")) || []
//localStorage.removeItem("habits")
let completedHabits = JSON.parse(localStorage.getItem("completedHabits")) || {}
//localStorage.removeItem("completedHabits")
let streaks = JSON.parse(localStorage.getItem("habitStreak")) || {}
let habitContainer = document.getElementById("habit-container")
let singleInputContainer = document.getElementById("single-input-container")
let istoggleColor = JSON.parse(localStorage.getItem("istoggleColor")) || false
const options = {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
}
showHabits()

if (istoggleColor) {
  document.getElementById("body").classList.add("dark")
  document.querySelector(".mainbar").classList.add("dark")
  document.getElementById("sidebar").classList.add("dark")
  document.getElementById("hamburger-menu").classList.add("dark")
  document.getElementById("check-streaks").classList.add("dark")
  document.getElementById("home-habits").classList.add("dark")
  singleInputContainer.classList.add("dark")
  document.getElementById("color-theme").classList.add("dark")
  const addhabitbtn = document.getElementById("addhabit")
  if (addhabitbtn) {
    addhabitbtn.classList.add("dark")
  }
  document.querySelectorAll("button").forEach(btn => {
    btn.classList.add("dark")
  })
  document.querySelectorAll("ul li").forEach(l => l.classList.add("dark"))
  document.getElementById("edit-container").classList.add("dark")
}
let currentEditIndex = null
const calendarContainer = document.getElementById("calendar-container")
document.getElementById("home").addEventListener("click", () => {
  if (calendarContainer.style.display === "flex") {
    if (habits.length > 0) {
      habitContainer.style.display = "grid"
      calendarContainer.style.display = "none"
      showHabits()
    } else {
      singleInputContainer.style.display = "flex"
      calendarContainer.style.display = "none"
    }
  }
})
document.getElementById("theme").addEventListener("click", () => {
  if (istoggleColor) {
    istoggleColor = false
    localStorage.setItem("istoggleColor", JSON.stringify(istoggleColor))
  } else {
    istoggleColor = true
    localStorage.setItem("istoggleColor", JSON.stringify(istoggleColor))
  }
  applydarkmode()
})

function applydarkmode() {
  const elements = [
    document.getElementById("body"),
    document.querySelector(".mainbar"),
    document.getElementById("sidebar"),
    document.getElementById("hamburger-menu"),
    document.getElementById("check-streaks"),
    document.getElementById("color-theme"),
    document.getElementById("home-habits"),
    singleInputContainer,
    document.getElementById("edit-container"),
    document.getElementById("habit-table")
  ]
  elements.forEach(el => el?.classList.toggle("dark", istoggleColor))
  document.querySelectorAll("button,ul li,td,th,td:first-child,.habit-box").forEach(el => {
    el.classList.toggle("dark")
  })
  const addhabitbtn = document.getElementById("addhabit")
  if (addhabitbtn) {
    addhabitbtn.classList.toggle("dark", istoggleColor)
  }
}

document.getElementById("singleaddhabit").addEventListener("click", addHabit)
let habitinput

function addHabit() {
  if (habitContainer.style.display === "none") {
    habitinput = document.getElementById("single-habit-input").value
  } else {
    habitinput = document.getElementById("habit-input").value
  }
  if (habitinput == "") return
  if (habits.some(habit => habit.name === habitinput)) {
    alert("This habit is already exists")
    return
  }
  const today = new Date()
  
  const habitSaved = today.toLocaleString('en-IN', options)
  
  habits.push({
    name: habitinput,
    date: habitSaved
  })
  localStorage.setItem("habits", JSON.stringify(habits))
  const streaks = JSON.parse(localStorage.getItem("habitStreak")) || {}
  if (!streaks[habitinput]) {
    streaks[habitinput] = { current: 0, best: 0, lastDate: null }
  }
  localStorage.setItem("habitStreak", JSON.stringify(streaks))
  showHabits()
  
  document.getElementById("habit-input").value = ""
}
let sidebar = document.getElementById("sidebar")
let hamburger = document.getElementById("hamburger-menu")

hamburger.addEventListener("click", (e) => {
  e.stopPropagation()
  sidebar.classList.toggle("hide-unhide")
  
})

document.body.addEventListener("click", (e) => {
  if (!sidebar.contains(e.target) && !hamburger.contains(e.target)) {
    sidebar.classList.remove("hide-unhide")
  }
})
sidebar.addEventListener("click", (e) => {
  e.stopPropagation()
})

function showHabits() {
  const today = getTodayKey()
  const completedHabits = JSON.parse(localStorage.getItem("completedHabits")) || {}
  console.log(completedHabits)
  console.log(today)
  const doneToday = completedHabits[today] || []
  console.log(doneToday)
  if (habits.length === 0) {
    habitContainer.style.display = "none"
    singleInputContainer.style.display = "flex"
    return
  }
  singleInputContainer.style.display = "none"
  habitContainer.style.display = "grid"
  habitContainer.innerHTML = ""
  habits.forEach((habit, index) => {
    let div = document.createElement("div")
    div.classList.add("habit-box")
    const isDone = doneToday.includes(habit.name)
    if (isDone) div.classList.add("habit-done")
    
    if (istoggleColor) {
      div.classList.add("dark")
      
    }
    console.log(habit.name)
    const habitInfo = findImageForHabit(habit.name);
    const streaks = JSON.parse(localStorage.getItem("habitStreak")) || {}
    const currentStreak = streaks[habit.name]?.current || 0
    const bestStreak = streaks[habit.name]?.best || 0
    // div.style.background=`linear-gradient(145deg,#${habitInfo.color[0]},#${habitInfo.color[1]})`
    div.innerHTML = `
    <img src="images/${habitInfo.image}" alt="${habit.name}" class="habit-img"/>
    <p>${habit.name}<span class="current-streak"> ${currentStreak}🔥</span>
    <span class="best-streak"> ${bestStreak}💗</span></p>
     
    <div class="button-container"><button class="delete">✖</button>
    <button class="edit">Edit</button>
    <button class="done">Done</div>`
    // div.querySelector(".done").onmouseenter=()=>{
    //  div.querySelector(".done").style.background=`#${habitInfo.color[0]}`
    // }
    // div.querySelector(".edit").onmouseenter=()=>{
    //  div.querySelector(".edit").style.background=`#${habitInfo.color[1]}`
    // }
    // div.querySelector(".done").onmouseleave = () => {
    // div.querySelector(".done").style.background =  "whitesmoke"
    //}
    //div.querySelector(".edit").onmouseleave = () => {
    // div.querySelector(".edit").style.background =  "whitesmoke"
    //}
    div.querySelector(".delete").addEventListener("click", () => {
      habits = habits.filter(h => h !== habit)
      localStorage.setItem("habits", JSON.stringify(habits))
      
      showHabits()
    })
    div.querySelector(".edit").addEventListener("click", () => {
        
        currentEditIndex = index
        document.getElementById("edit-habit").value = habits[index].name
        document.getElementById("edit-container").style.display = "flex"
        document.getElementById("habit-container").classList.add("disabled")
      }
      
    )
    div.querySelector(".done").addEventListener("click", () => {
      
      if (!completedHabits[today])
        completedHabits[today] = []
      if (!completedHabits[today].includes(habit.name)) {
        
        completedHabits[today].push(habit.name)
        localStorage.setItem("completedHabits", JSON.stringify(completedHabits))
        
        const streaks = JSON.parse(localStorage.getItem("habitStreak")) || {}
        const habitStreak = streaks[habit.name] || { current: 0, best: 0, lastDate: null }
        
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const yesterdayKey = yesterday.toISOString().split("T")[0]
        if (habitStreak.lastDate === yesterdayKey) {
          habitStreak.current += 1
        } else if (habitStreak.lastDate === today) {}
        else {
          habitStreak.current = 1
        }
        habitStreak.lastDate = today
        habitStreak.best = Math.max(habitStreak.best, habitStreak.current)
        
        streaks[habit.name] = habitStreak
        localStorage.setItem("habitStreak", JSON.stringify(streaks))
      }
      
      
      showHabits()
      
    })
    habitContainer.append(div)
  })
  const inputBox = document.createElement("div")
  inputBox.classList.add("habit-box")
  inputBox.innerHTML = `
  
  <input type="text" placeholder="Enter a habit..." id="habit-input">
  <button id="addhabit">✛ Add new Habit</button>
`
  
  if (istoggleColor) {
    inputBox.classList.add("dark")
    document.getElementById("e-delete").classList.add("dark")
    const addhabitbtn = document.getElementById("addhabit")
    if (addhabitbtn) {
      addhabitbtn.classList.add("dark")
    }
    
    document.querySelector(".delete").classList.add("dark")
    document.querySelectorAll("button").forEach(btn => {
      btn.classList.add("dark")
    })
    
  }
  habitContainer.append(inputBox)
  const addhabitbtn = document.getElementById("addhabit")
  if (istoggleColor && addhabitbtn) {
    addhabitbtn.classList.add("dark")
  }
  document.getElementById("addhabit").addEventListener("click", addHabit)
  
}
document.getElementById("e-delete").addEventListener("click", () => {
  document.getElementById("edit-container").style.display = "none"
  document.getElementById("habit-container").classList.remove("disabled")
})
document.getElementById("habitEditBtn").addEventListener("click", () => {
  
  const newName = document.getElementById("edit-habit").value.trim()
  if (newName == "") return
  if (habits.some(h => h.name === newName)) {
    alert("this habit already exists!!")
    return;
    
  }
  const oldName = habits[currentEditIndex].name
  
  const streaks = JSON.parse(localStorage.getItem("habitStreak")) || {}
  if (streaks[oldName]) {
    streaks[newName] = streaks[oldName]
    delete streaks[oldName]
    localStorage.setItem("habitStreak", JSON.stringify(streaks))
  }
  habits[currentEditIndex].name = newName
  
  console.log(newName)
  
  localStorage.setItem("habits", JSON.stringify(habits))
  
  showHabits()
  
  document.getElementById("edit-container").style.display = "none"
  document.getElementById("habit-container").classList.remove("disabled")
  
})

function findImageForHabit(habitText) {
  for (let item of images) {
    for (let keyword of item.keys) {
      if (habitText.toLowerCase().includes(keyword.toLowerCase())) {
        if (Array.isArray(item.image)) {
          const randomIndex = Math.floor(Math.random() * item.image.length)
          return { image: `${item.image[randomIndex]}.png`, color: item.color }
        }
        
        return { image: `${item.image}.png`, color: item.color }
      }
    }
  }
  return { image: "to-do-list.png", color: ["085078", "85d8ce"] }
}

function getTodayKey() {
  return new Date().toISOString().split("T")[0]
  
}


document.getElementById("calendar").addEventListener("click", () => {
  const cal = document.getElementById("calendar-container")
  if (singleInputContainer.style.display === "flex" || habitContainer.style.display === "grid") {
    cal.style.display = "flex"
    singleInputContainer.style.display = "none"
    habitContainer.style.display = "none"
    document.getElementById("edit-container").style.display = "none"
    renderCalendar()
    if (istoggleColor) {
      document.getElementById("habit-table").classList.add("dark")
      document.querySelectorAll("th,td").forEach(th => th.classList.add("dark"))
      document.querySelectorAll("td:first-child").forEach(td => td.classList.add("dark"))
      document.getElementById("next-month").classList.add("dark")
      document.getElementById("prev-month").classList.add("dark")
    }
  }
})
let currentMonth = new Date().getMonth()
let currentYear = new Date().getFullYear()
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
document.getElementById("prev-month").addEventListener("click", () => {
  currentMonth--
  if (currentMonth < 0) {
    currentMonth = 11
    currentYear--
  }
  renderCalendar()
  if (istoggleColor) {
    document.getElementById("habit-table").classList.add("dark")
    document.querySelectorAll("th,td").forEach(th => th.classList.add("dark"))
    document.querySelectorAll("td:first-child").forEach(td => td.classList.add("dark"))
    document.getElementById("next-month").classList.add("dark")
    document.getElementById("prev-month").classList.add("dark")
  }
})
document.getElementById("next-month").addEventListener("click", () => {
  currentMonth++
  if (currentMonth > 11) {
    currentMonth = 0
    currentYear++
  }
  renderCalendar()
  if (istoggleColor) {
    document.getElementById("habit-table").classList.add("dark")
    document.querySelectorAll("th,td").forEach(th => th.classList.add("dark"))
    document.querySelectorAll("td:first-child").forEach(td => td.classList.add("dark"))
    document.getElementById("next-month").classList.add("dark")
    document.getElementById("prev-month").classList.add("dark")
  }
})

function getDatesSinceStart(startdate) {
  const dates = []
  const start = new Date(startdate)
  const today = new Date()
  while (start <= today) {
    dates.push(start.toISOString().split("T")[0])
    start.setDate(start.getDate() + 1)
  }
  return dates
}

function renderCalendar() {
  const habits = JSON.parse(localStorage.getItem("habits")) || []
  const completedHabits = JSON.parse(localStorage.getItem("completedHabits")) || {}
  
  const year = currentYear
  const month = currentMonth
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  document.getElementById("month-label").textContent = `${monthNames[month]} ${year}`
  const headerRow = document.querySelector(" #habit-table thead tr")
  const body = document.getElementById("habit-body")
  headerRow.innerHTML = "<th style='min-width:150px;'>Habit</th>"
  body.innerHTML = ""
  
  if (istoggleColor) {
    document.getElementById("habit-table").classList.add("dark")
    document.querySelectorAll("th,td").forEach(th => th.classList.add("dark"))
    document.querySelectorAll("td:first-child").forEach(td => td.classList.add("dark"))
    document.getElementById("next-month").classList.add("dark")
    document.getElementById("prev-month").classList.add("dark")
  } else {
    document.getElementById("habit-table").classList.remove("dark")
    document.querySelectorAll("th").forEach(th => th.classList.remove("dark"))
    document.querySelectorAll("td:first-child").forEach(td => td.classList.remove("dark"))
    document.getElementById("next-month").classList.remove("dark")
    document.getElementById("prev-month").classList.remove("dark")
  }
  
  for (let d = 1; d <= daysInMonth; d++) {
    const th = document.createElement("th")
    th.textContent = d
    if (d === today.toISOString().split("T")[0]) {
      th.style.background = "#967ea7"
      th.style.color = "white"
      
    }
    headerRow.appendChild(th)
  }
  habits.forEach(habit => {
    const streaks = JSON.parse(localStorage.getItem("habitStreak")) || {}
const currentStreak = streaks[habit.name]?.current || 0
const bestStreak = streaks[habit.name]?.best || 0
    const row = document.createElement("tr")
    const nameTd = document.createElement("td")
    nameTd.innerHTML = `${habit.name}<span class="beststreak">${bestStreak>-1?bestStreak:""}</span>`
    
    row.appendChild(nameTd)
    
    
    const habitStart = new Date(habit.date)
    const habitDates = getDatesSinceStart(habit.date)
    
    
    for (let d = 1; d <= daysInMonth; d++) {
      
      const dateKey = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
      
      const cellDate = new Date(`${dateKey}T00:00:00`)
      
      const td = document.createElement("td")
      if (cellDate < habitStart) {
        td.innerHTML = "-"
        row.appendChild(td)
        continue
      }
      const checkbox = document.createElement("input")
      const spancheck = document.createElement("span")
      spancheck.classList.add("spancheck")
      checkbox.type = "checkbox"
      checkbox.name = "hidedcheckbox"
      checkbox.classList.add("checkbox")
      
      if (completedHabits[dateKey]?.includes(habit.name)) {
        checkbox.checked = true
        spancheck.classList.add("checked")
      } else if (cellDate < today) {
        
        spancheck.classList.add("unchecked")
      }
      
      spancheck.addEventListener("click", () => {
          const data = JSON.parse(localStorage.getItem("completedHabits")) || {}
          data[dateKey] = data[dateKey] || []
          const isChecked = completedHabits[dateKey]?.includes(habit.name)
          if (isChecked) {
            data[dateKey] = data[dateKey].filter(h => h !== habit.name)
            spancheck.classList.remove("checked")
            if (cellDate < today) {
              spancheck.classList.add("unchecked")
            }
          } else {
            data[dateKey].push(habit.name)
            spancheck.classList.remove("unchecked")
            spancheck.classList.add("checked")
            
            const streaks = JSON.parse(localStorage.getItem("habitStreak")) || {}
            const habitStreak = streaks[habit.name] || { current: 0, best: 0, lastDate: null }
            
            const checkedDate = new Date(dateKey)
            const prevDate = new Date(checkedDate)
            prevDate.setDate(prevDate.getDate() - 1)
            const prevKey = prevDate.toISOString().split("T")[0]
            if (habitStreak.lastDate === prevKey) {
              habitStreak.current += 1
            } else if (habitStreak.lastDate === today) {}
            else {
              habitStreak.current = 1
            }
            habitStreak.lastDate = today
            habitStreak.best = Math.max(habitStreak.best, habitStreak.current)
            
            streaks[habit.name] = habitStreak
            localStorage.setItem("habitStreak", JSON.stringify(streaks))
          }
          checkbox.checked = data[dateKey].includes(habit.name)
          localStorage.setItem("completedHabits", JSON.stringify(data))
          
        }
        
      )
      td.appendChild(spancheck)
      td.appendChild(checkbox)
      row.appendChild(td)
    }
    body.appendChild(row)
    
  })
}