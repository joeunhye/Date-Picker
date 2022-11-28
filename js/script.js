class DatePicker {
	monthData = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	#calenderDate = {
		data: "",
		date: 0,
		month: 0,
		year: 0,
	};
	selectedDate = {
		data: "",
		date: 0,
		month: 0,
		year: 0,
	};
	datePickerEl;
	dateInputEl;
	calendarEl;
	calendarMonthEl;
	monthContentEl;
	nextBtnEl;
	prevBtnEl;
	calendarDatesEl;

	constructor() {
		this.initCalenderDate();
		this.initSelectedDate();
		this.assignElement();
		this.setDateInput();
		this.addEvents();
		this.updateMonth();
	}

	assignElement() {
		this.datePickerEl = document.getElementById("date-picker");
		this.dateInputEl = this.datePickerEl.querySelector("#date-input");
		this.calendarEl = this.datePickerEl.querySelector("#calendar");
		this.calendarMonthEl = this.calendarEl.querySelector("#month");
		this.monthContentEl = this.calendarMonthEl.querySelector("#content");
		this.nextBtnEl = this.calendarMonthEl.querySelector("#next");
		this.prevBtnEl = this.calendarMonthEl.querySelector("#prev");
		this.calendarDatesEl = this.calendarEl.querySelector("#dates");
	}
	addEvents() {
		this.dateInputEl.addEventListener("click", this.toggleCalendar);
		this.nextBtnEl.addEventListener("click", this.moveToNextMonth);
		this.prevBtnEl.addEventListener("click", this.moveToPrevMonth);
		this.calendarDatesEl.addEventListener("click", this.onClickSelectDate);
	}

	initCalenderDate() {
		//날짜 초기 설정 세팅
		const data = new Date();
		const date = data.getDate();
		const month = data.getMonth();
		const year = data.getFullYear();
		this.#calenderDate = {
			data,
			date,
			month,
			year,
		};
	}

	initSelectedDate() {
		//선택한 날짜 초기 세팅
		this.selectedDate = { ...this.#calenderDate };
	}

	setDateInput() {
		//날짜 정보 표기
		this.dateInputEl.textContent = new Intl.DateTimeFormat("ko-KR").format(this.selectedDate.data);
		this.dateInputEl.dataset.value = this.selectedDate.data;
	}
	toggleCalendar = () => {
		//캘린더 노출 제어
		this.calendarEl.classList.toggle("active");
		this.updateDates();
	};

	updateMonth() {
		// 월 설정
		this.monthContentEl.textContent = `${this.#calenderDate.year} ${this.monthData[this.#calenderDate.month]}`;
	}

	updateDates() {
		//일 설정
		this.calendarDatesEl.innerHTML = "";
		const numberOfDates = new Date(this.#calenderDate.year, this.#calenderDate.month + 1, 0).getDate();
		const fragment = new DocumentFragment();
		for (let i = 0; i < numberOfDates; i++) {
			const dateEl = document.createElement("div");
			dateEl.classList.add("date");
			dateEl.textContent = i + 1;
			dateEl.dataset.date = i + 1;
			fragment.appendChild(dateEl);
		}
		fragment.firstChild.style.gridColumnStart = new Date(this.#calenderDate.year, this.#calenderDate.month, 1).getDay() + 1;
		this.calendarDatesEl.appendChild(fragment);
		this.colorSunday();
		this.colorSaturday();
		this.markToday();
		this.markSelectedDate();
	}
	onClickSelectDate = e => {
		// 날짜 선택
		const target = e.target;
		if (target.dataset.date) {
			this.calendarDatesEl.querySelector(".selected")?.classList.remove("selected");
			target.classList.add("selected");
			this.selectedDate = {
				data: new Date(this.#calenderDate.year, this.#calenderDate.month, target.dataset.date),
				year: this.#calenderDate.year,
				month: this.#calenderDate.month,
				date: target.dataset.date,
			};
		}
		this.setDateInput();
		this.calendarEl.classList.remove("active");
	};
	markSelectedDate() {
		//선택 날짜 표시
		if (this.selectedDate.year === this.#calenderDate.year && this.selectedDate.month === this.#calenderDate.month) {
			this.calendarDatesEl.querySelector(`[data-date='${this.selectedDate.date}']`).classList.add("selected");
		}
	}
	moveToNextMonth = () => {
		// 다음 달 이동
		this.#calenderDate.month++;
		if (this.#calenderDate.month > 11) {
			this.#calenderDate.month = 0;
			this.#calenderDate.year++;
		}
		this.updateMonth();
		this.updateDates();
	};
	moveToPrevMonth = () => {
		//이전 달 이동
		this.#calenderDate.month--;
		if (this.#calenderDate.month < 0) {
			this.#calenderDate.month = 11;
			this.#calenderDate.year--;
		}
		this.updateMonth();
		this.updateDates();
	};

	markToday() {
		//오늘 날짜 표시
		const currentDate = new Date();
		const currentMonth = currentDate.getMonth();
		const currentYear = currentDate.getFullYear();
		const today = currentDate.getDate();
		if (currentYear === this.#calenderDate.year && currentMonth === this.#calenderDate.month) {
			this.calendarDatesEl.querySelector(`[data-date='${today}']`).classList.add("today");
		}
	}
	colorSaturday() {
		const saturdayEls = this.calendarDatesEl.querySelectorAll(`.date:nth-child(7n+${7 - new Date(this.#calenderDate.year, this.#calenderDate.month, 1).getDay()})`);
		for (let i = 0; i < saturdayEls.length; i++) {
			saturdayEls[i].style.color = "blue";
		}
	}
	colorSunday() {
		const sundayEls = this.calendarDatesEl.querySelectorAll(`.date:nth-child(7n+${8 - (new Date(this.#calenderDate.year, this.#calenderDate.month, 1).getDay() % 7)})`);
		for (let i = 0; i < sundayEls.length; i++) {
			sundayEls[i].style.color = "red";
		}
	}
}

new DatePicker();
