import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [publicCourses, setPublicCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  useEffect(() => {
  if (user.role === "student") {
    fetch("http://localhost:5000/api/courses/public")
      .then((res) => res.json())
      .then((data) => setPublicCourses(Array.isArray(data) ? data : []))
      .catch(() => setPublicCourses([]));

    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/courses/student/my", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setMyCourses(Array.isArray(data) ? data : []))
      .catch(() => setMyCourses([]));
  }
}, [user.role]);

  if (user.role === "student") {
    const demoCourses = [
      {
        id: "demo-1",
        title: "Основы искусственного интеллекта",
        description:
          "Познакомьтесь с ключевыми понятиями AI, нейросетей и интеллектуальных образовательных систем.",
        image:
          "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=900&q=80",
        teacher_name: "AIvolution Team",
      },
      {
        id: "demo-2",
        title: "Введение в C++",
        description:
          "Базовый курс по синтаксису, переменным, условиям, циклам и первым программам на C++.",
        image:
          "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80",
        teacher_name: "Преподаватель",
      },
      {
        id: "demo-3",
        title: "Цифровые технологии обучения",
        description:
          "Разберите, как современные LMS, тесты и AI-помощники улучшают дистанционное образование.",
        image:
          "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
        teacher_name: "Методист",
      },
    ];

  const coursesToShow = publicCourses.length > 0 ? publicCourses : demoCourses;
const continueCourse =
  myCourses.find((course) => Number(course.progress || 0) < 100) ||
  myCourses[0];
    return (
      <div className="student-home">
        <section className="student-hero">
          <div className="student-hero-content">
            <span className="eyebrow">AIvolution Learning Platform</span>
            <h1>
              Учитесь онлайн с поддержкой{" "}
              <span>искусственного интеллекта</span>
            </h1>
            <p>
              AIvolution помогает проходить курсы, смотреть уроки, сдавать
              тесты и получать персональные рекомендации после обучения.
            </p>

            <div className="student-hero-actions">
              <Link to="/student/courses" className="btn primary">
                Смотреть курсы
              </Link>
              <Link to="/student/my-courses" className="btn soft">
                Мои курсы
              </Link>
            </div>

            <div className="student-hero-stats">
              <div>
                <strong>AI</strong>
                <span>помощник</span>
              </div>
              <div>
                <strong>30 мин</strong>
                <span>тестирование</span>
              </div>
              <div>
                <strong>100%</strong>
                <span>прогресс курса</span>
              </div>
            </div>
          </div>

          <div className="student-hero-visual">
            <div className="floating-card card-top">
              <strong>Прогресс</strong>
              <div className="mini-progress">
                <span style={{ width: "72%" }}></span>
              </div>
              <p>72% курса пройдено</p>
            </div>

            <div className="orb-main">AI</div>

            <div className="floating-card card-bottom">
              <strong>AI-рекомендация</strong>
              <p>Повторите тему тестирования и закрепите материал урока.</p>
            </div>
          </div>
        </section>
{continueCourse && (
  <section className="continue-learning-card">
    <div>
      <span className="eyebrow">Continue Learning</span>
      <h2>Продолжить обучение</h2>
      <p>
        Вы остановились на курсе “{continueCourse.title}”. Продолжайте проходить
        уроки и готовьтесь к итоговому тесту.
      </p>

      <div className="progress-wrap">
        <div className="progress-top">
          <span>Прогресс курса</span>
          <strong>{continueCourse.progress || 0}%</strong>
        </div>
        <div className="progress-line">
          <span style={{ width: `${continueCourse.progress || 0}%` }} />
        </div>
      </div>
    </div>

    <Link to={`/student/course/${continueCourse.id}`} className="btn primary">
      Открыть курс
    </Link>
  </section>
)}
        <section className="about-platform">
          <div>
            <span className="eyebrow">О платформе</span>
            <h2>AIvolution — адаптивная система дистанционного образования</h2>
          </div>

          <p>
            Платформа создана для удобного онлайн-обучения: преподаватели
            добавляют курсы, уроки и тесты, а студенты проходят материалы в
            личном кабинете. Система фиксирует прогресс, результаты тестов и
            помогает лучше понимать темы с помощью AI.
          </p>
        </section>

        <section className="student-features">
          <div className="feature-card">
            <div className="feature-icon">01</div>
            <h3>Курсы от преподавателей</h3>
            <p>
              Все курсы создаются через интерфейс: с описанием, уроками,
              видео и тестами.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">02</div>
            <h3>Личный прогресс</h3>
            <p>
              Система показывает, сколько уроков просмотрено и насколько курс
              завершен.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">03</div>
            <h3>AI-поддержка</h3>
            <p>
              После теста студент получает рекомендации, чтобы понять, какие
              темы стоит повторить.
            </p>
          </div>
        </section>

        <section className="home-courses-section">
          <div className="section-head">
            <div>
              <span className="eyebrow">Популярные курсы</span>
              <h2>Начните обучение с доступных программ</h2>
            </div>

            <Link to="/student/courses" className="btn soft">
              Все курсы
            </Link>
          </div>

          <div className="home-course-grid">
            {coursesToShow.map((course) => (
              <div className="home-course-card" key={course.id}>
                <div className="home-course-img">
                  <img src={course.image} alt={course.title} />
                </div>

                <div className="home-course-content">
                  <span>{course.teacher_name || "Преподаватель"}</span>
                  <h3>{course.title}</h3>
                  <p>{course.description}</p>

                  <Link to="/student/courses" className="course-link">
                    Подробнее →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  const data = {
    admin: {
      eyebrow: "Admin Workspace",
      title: "Центр управления AIvolution",
      desc: "Контролируйте пользователей, назначайте роли преподавателям и следите за структурой платформы.",
      cards: [
        ["Пользователи", "Управление студентами и преподавателями", "/admin"],
        ["Роли", "Назначайте teacher или student через админ-панель", "/admin"],
        ["Безопасность", "Регистрация доступна только студентам", "/admin"],
      ],
    },
    teacher: {
      eyebrow: "Teacher Workspace",
      title: "Кабинет преподавателя",
      desc: "Создавайте курсы, добавляйте уроки, тесты и отслеживайте прогресс студентов.",
      cards: [
        ["Курсы", "Создавайте полноценные учебные программы", "/courses"],
        ["Уроки", "Добавляйте YouTube-видео и материалы", "/courses"],
        ["Студенты", "Смотрите прогресс и результаты тестов", "/teacher/students"],
      ],
    },
  };

  const current = data[user.role];

  return (
    <div className="page">
      <div className="hero-panel dashboard-hero">
        <div>
          <span className="eyebrow">{current.eyebrow}</span>
          <h1>{current.title}</h1>
          <p>{current.desc}</p>
        </div>

        <div className="hero-stat">
          <strong>{user.role}</strong>
          <span>{user.email}</span>
        </div>
      </div>

      <div className="dashboard-grid">
        {current.cards.map((card, index) => (
          <Link to={card[2]} className="dash-card" key={index}>
            <div className="dash-icon">{index + 1}</div>
            <h3>{card[0]}</h3>
            <p>{card[1]}</p>
            <span>Перейти →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}