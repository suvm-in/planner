const posts = [
    {
        id: 1,
        category: "일상",
        title: "오늘의 노을이 정말 예뻤다",
        content: "하루가 끝나가는 시간이 이렇게 아름다울 줄이야. 오랜만에 마음이 편안해졌다.",
        date: "2026.10.25"
    },
    {
        id: 2,
        category: "생각",
        title: "새로운 시작을 준비하며",
        content: "지금까지 해온 것들을 돌아보며 앞으로 더 좋은 방향으로 나아가고 싶다.",
        date: "2026.10.24"
    },
    {
        id: 3,
        category: "여행",
        title: "주말에 다녀온 작은 여행",
        content: "맑은 공기와 푸른 나무 덕분에 일상의 스트레스를 잠시 잊을 수 있었다.",
        date: "2026.10.22"
    }
];

// HTML 요소 선택
const postList = document.querySelector("#post-list");
const postCount = document.querySelector("#post-count");

// 게시글 영역이 있는 페이지(index.html, list.html 등)에서만 실행
if (postList) {
    if (postCount) {
        // 게시글 개수 표시
        postCount.textContent = `총 ${posts.length}개의 글`;
    }

    // 게시글 카드 생성
    posts.forEach(function(post) {
        // 카드 요소 생성
        const card = document.createElement("article");
        card.className = "post-card";

        // 카테고리
        const category = document.createElement("span");
        category.className = "category";
        category.textContent = post.category;

        // 제목
        const title = document.createElement("h3");
        title.textContent = post.title;

        // 본문
        const content = document.createElement("p");
        content.className = "post-content";
        content.textContent = post.content;

        // 작성일
        const date = document.createElement("p");
        date.className = "post-date";
        date.textContent = post.date;

        // 카드에 요소 추가
        card.append(category, title, content, date);

        // 게시글 목록에 카드 추가
        postList.appendChild(card);
    });
}


// 글쓰기 페이지
const writeForm = document.querySelector("#write-form");

if (writeForm) {
    writeForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const newPost = {
            id: Date.now(),
            category: document.querySelector("#category").value,
            title: document.querySelector("#title").value,
            content: document.querySelector("#content").value,
            date: new Date().toLocaleDateString("ko-KR")
        };

        posts.push(newPost);

        localStorage.setItem("posts", JSON.stringify(posts));

        alert("글이 등록되었습니다!");

        location.href = "index.html";
    });
}


// ===================== 캘린더 (주간 / 월간) =====================
const weekView = document.querySelector("#weekView");
const monthView = document.querySelector("#monthView");
const monthGrid = document.querySelector("#monthGrid");
const calendarLabel = document.querySelector("#calendarLabel");
const prevBtn = document.querySelector("#prevBtn");
const nextBtn = document.querySelector("#nextBtn");
const toggleViewBtn = document.querySelector("#toggleViewBtn");

// 캘린더 요소가 있는 페이지(메인 페이지)에서만 실행
if (weekView && monthView && monthGrid && calendarLabel && prevBtn && nextBtn && toggleViewBtn) {

    const weekdayNames = ["일", "월", "화", "수", "목", "금", "토"];

    let viewMode = "week";          // "week" | "month"
    let currentDate = new Date();   // 현재 보고 있는 기준 날짜

    // 날짜 비교 (연/월/일만)
    function isSameDate(a, b) {
        return a.getFullYear() === b.getFullYear() &&
               a.getMonth() === b.getMonth() &&
               a.getDate() === b.getDate();
    }

    // posts 배열의 date("2026.10.25")와 비교해서 해당 날짜에 글이 있는지 확인
    function hasPostOn(date) {
        return posts.some(function(post) {
            const parts = post.date.split(".").map(Number);
            if (parts.length < 3) return false;
            const postDate = new Date(parts[0], parts[1] - 1, parts[2]);
            return isSameDate(postDate, date);
        });
    }

    // 해당 날짜가 속한 주의 일요일 반환
    function getWeekStart(date) {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() - d.getDay());
        return d;
    }

    // 주간 캘린더 렌더링
    function renderWeekView() {
        const weekStart = getWeekStart(currentDate);
        const today = new Date();

        weekView.innerHTML = "";

        for (let i = 0; i < 7; i++) {
            const day = new Date(weekStart);
            day.setDate(weekStart.getDate() + i);

            const dayEl = document.createElement("div");
            dayEl.className = "day-cell";
            if (isSameDate(day, today)) dayEl.classList.add("today");
            if (day.getDay() === 0) dayEl.classList.add("sunday");
            if (day.getDay() === 6) dayEl.classList.add("saturday");

            const numEl = document.createElement("span");
            numEl.className = "day-number";
            numEl.textContent = day.getDate();

            dayEl.append(numEl);

            if (hasPostOn(day)) {
                const dot = document.createElement("span");
                dot.className = "day-dot";
                dayEl.appendChild(dot);
            }

            weekView.appendChild(dayEl);
        }

        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);

        calendarLabel.textContent =
            `${weekStart.getFullYear()}년 ${weekStart.getMonth() + 1}월 ${weekStart.getDate()}일 - ${weekEnd.getMonth() + 1}월 ${weekEnd.getDate()}일`;
    }

    // 월간 캘린더 렌더링 (6주 = 42칸 고정)
    function renderMonthView() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const today = new Date();

        const firstDay = new Date(year, month, 1);
        const startDate = getWeekStart(firstDay);

        monthGrid.innerHTML = "";

        for (let i = 0; i < 42; i++) {
            const day = new Date(startDate);
            day.setDate(startDate.getDate() + i);

            const dayEl = document.createElement("div");
            dayEl.className = "month-cell";
            if (day.getMonth() !== month) dayEl.classList.add("other-month");
            if (isSameDate(day, today)) dayEl.classList.add("today");

            const numEl = document.createElement("span");
            numEl.className = "day-number";
            numEl.textContent = day.getDate();
            dayEl.appendChild(numEl);

            if (hasPostOn(day)) {
                const dot = document.createElement("span");
                dot.className = "day-dot";
                dayEl.appendChild(dot);
            }

            monthGrid.appendChild(dayEl);
        }

        calendarLabel.textContent = `${year}년 ${month + 1}월`;
    }

    // 현재 viewMode에 맞게 화면 갱신
    function render() {
        if (viewMode === "week") {
            weekView.style.display = "grid";
            monthView.style.display = "none";
            renderWeekView();
        } else {
            weekView.style.display = "none";
            monthView.style.display = "block";
            renderMonthView();
        }
    }

    // 이전 버튼: 주간이면 -7일, 월간이면 -1달
    prevBtn.addEventListener("click", function() {
        if (viewMode === "week") {
            currentDate.setDate(currentDate.getDate() - 7);
        } else {
            currentDate.setMonth(currentDate.getMonth() - 1);
        }
        render();
    });

    // 다음 버튼: 주간이면 +7일, 월간이면 +1달
    nextBtn.addEventListener("click", function() {
        if (viewMode === "week") {
            currentDate.setDate(currentDate.getDate() + 7);
        } else {
            currentDate.setMonth(currentDate.getMonth() + 1);
        }
        render();
    });

    // 주간 <-> 월간 전환 버튼
    toggleViewBtn.addEventListener("click", function() {
        viewMode = (viewMode === "week") ? "month" : "week";
        toggleViewBtn.textContent = (viewMode === "week") ? "월간 보기" : "주간 보기";
        render();
    });

    render();
}
