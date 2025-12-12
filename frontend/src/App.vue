<template>
  <router-view />
</template>

<style lang="scss">
body {
  font-family: 'Poppins', sans-serif;
  background-color: #f9f7f7;
}
.sidebar {
  background: linear-gradient(180deg, #8e2de2 0%, #4a00e0 100%);
}
.appointment-card {
  transition: all 0.3s ease;
}
.appointment-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}
.calendar-day {
  transition: all 0.2s ease;
}
.calendar-day:hover:not(.inactive):not(.selected) {
  background-color: #f0e6ff;
}
.calendar-day.selected {
  background: linear-gradient(45deg, #8e2de2, #4a00e0);
  color: white;
}
.calendar-day.inactive {
  opacity: 0.3;
  cursor: default;
}
.time-slot {
  transition: all 0.2s ease;
}
.time-slot:hover:not(.booked) {
  background-color: #f0e6ff;
}
.time-slot.booked {
  background-color: #ffebee;
  cursor: not-allowed;
}
.time-slot.selected {
  background: linear-gradient(45deg, #8e2de2, #4a00e0);
  color: white;
}
.tab {
  transition: all 0.3s ease;
}
.tab.active {
  border-bottom: 3px solid #8e2de2;
  color: #8e2de2;
  font-weight: 600;
}
.service-card {
  transition: all 0.3s ease;
}
.service-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}
.service-card.selected {
  border: 2px solid #8e2de2;
}
.stylist-card {
  transition: all 0.3s ease;
}
.stylist-card:hover {
  transform: translateY(-3px);
}
.stylist-card.selected {
  border: 2px solid #8e2de2;
}
.notification-badge {
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0% {
    transform: scale(0.95);
  }
  70% {
    transform: scale(1);
  }
  100% {
    transform: scale(0.95);
  }
}
.modal {
  transition: all 0.3s ease;
}
.dropdown {
  transition: all 0.3s ease;
}
</style>
