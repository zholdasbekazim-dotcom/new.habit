let habits = JSON.parse(localStorage.getItem("habits")) || [];
let isLogin = true;

function toggleAuth() {
  isLogin = !isLogin;
  document.getElementById("authTitle").innerText = isLogin ? "Login" : "Register";
}

function handleAuth() {
  const user = username.value;
  const pass = password.value;
  if (!user || !pass) return alert("Толтырыңыз!");

  const users = JSON.parse(localStorage.getItem("users")) || {};

  if (isLogin) {
    if (users[user] === pass) {
      localStorage.setItem("currentUser", user);
      loadApp();
    } else alert("Қате логин!");
  } else {
    users[user] = pass;
    localStorage.setItem("users", JSON.stringify(users));
    alert("Тіркелді!");
    toggleAuth();
  }
}

function loadApp() {
  authSection.style.display = "none";
  appSection.style.display = "block";
  render();
}

function logout() {
  localStorage.removeItem("currentUser");
  location.reload();
}

function showSection(sec) {
  dashboardSection.style.display = "none";
  analyticsSection.style.display = "none";
  settingsSection.style.display = "none";
  document.getElementById(sec + "Section").style.display = "block";
}

function addHabit() {
  if (!habitInput.value) return;
  habits.push({ name: habitInput.value, done: false, streak: 0 });
  habitInput.value = "";
  save();
  render();
}

function toggleHabit(i) {
  habits[i].done = !habits[i].done;
  habits[i].streak = habits[i].done ? habits[i].streak + 1 : 0;
  checkAchievement(habits[i]);
  save();
  render();
}

function deleteHabit(i) {
  habits.splice(i,1);
  save();
  render();
}

function render() {
  habitList.innerHTML = "";
  habits.forEach((h,i)=>{
    habitList.innerHTML += `
      <div class="habit ${h.done?'done':''}">
        ${h.name} (${h.streak})
        <div>
          <button onclick="toggleHabit(${i})">✔</button>
          <button onclick="deleteHabit(${i})">❌</button>
        </div>
      </div>`;
  });
  updateGoal();
}

function updateGoal() {
  const total = habits.length;
  const done = habits.filter(h=>h.done).length;
  const percent = total===0?0:(done/total)*100;
  goalBar.style.width = percent+"%";
  goalText.innerText = `${done} / ${total} completed`;
}

function checkAchievement(h) {
  if (h.streak === 7) {
    achievementPopup.classList.add("show");
    setTimeout(()=>achievementPopup.classList.remove("show"),3000);
  }
}

const Pomodoro = {
  time: 25*60, // 25 минут
  interval: null,

  start: function() {
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      if (this.time <= 0) {
        clearInterval(this.interval);
        alert("Pomodoro finished! Take a break ☕");
        this.reset();
        return;
      }
      this.time--;
      this.updateDisplay();
    }, 1000);
  },

  reset: function() {
    clearInterval(this.interval);
    this.time = 25*60;
    this.updateDisplay();
  },

  updateDisplay: function() {
    let minutes = Math.floor(this.time / 60);
    let seconds = this.time % 60;
    document.getElementById("timerDisplay").innerText =
      `${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
  }
}

// бет жүктелгенде көрсету
Pomodoro.updateDisplay();

