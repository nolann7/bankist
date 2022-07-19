'use strict';

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const header = document.querySelector('.header');

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const nav = document.querySelector('.nav');
const initialCoords = section1.getBoundingClientRect();

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//////*
// Scrolling
//Метод Element.getBoundingClientRect() возвращает размер элемента и его позицию относительно viewport (часть страницы, показанная на экране, и которую мы видим).
btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();

  section1.scrollIntoView({ behavior: 'smooth' }); // новый метод проскролить к нужному элементу
});

////////////////////////////////////////
// // Page Navigation
// document.querySelectorAll('.nav__link').forEach(el =>  //задаем eventListener сразу трем элементам в навигации
//   el.addEventListener('click', function (e) {
//     e.preventDefault(); // в данном случае e.preventDefault - будет означать что при нажатии по ссылкам в навигации, страница не будет перемещаться к якорям, которые указаны в html - (ссылки заданные через # и имя Id элемента к которому будет перепрыгивать)
//     const id = this.getAttribute('href'); // #section--1/2/3 - взяли относительную ссылку из атрибута href соответствующего элемента
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });  // выбираем элемент через переменную id, которую мы получили из getAttribute - и задаем к этому элементу smooth scroll
//   })
// );
// // - этот способ работает, но он не очень эффективен, так как создается на каждую кнопку по event handler-у, если элементов очень много - то это плохо, поэтому нужно использовать способ ниже:

// Event Delagation (Делегирование событий)
// https://learn.javascript.ru/event-delegation

// 1 Добавить event listener в общий родительский элемент
// 2 Узнать с какого элемента пришло событие
////////////////////////////////////////////////

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // Matching strategy - отделяем только элементы, которые нам нужны что бы реагировали на клик:
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    if (id !== '#')
      document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// Tabbed component

// мы можем добавить eventListener на каждую кнопку tab:
// tabs.forEach(el => el.addEventListener('click',() => console.log(el.getAttribute('data-tab')))) // 1/2/3
// но делать этого не будем, потому что это плохая практика, поэтому используем event delagation

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab'); // мы хотим получить только элементы табов, поэтому используем closest
  // Guard clause
  if (!clicked) return; // если не было клика или клик вернул null - выйти из функции;
  // Remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active')); // перед добавлением класа "активности" - убираем этот класс со всех табов
  tabsContent.forEach(c => c.classList.remove('operations__content--active')); // удаляем из всех элементов контента класс 'active'
  // Activate Tab
  clicked.classList.add('operations__tab--active'); // добавили класс табу - что бы он стал активным
  // Activate Content Area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active'); // добавили в нужный элемент контента класс 'active'
});

// Menu fading animation
// mouseover, mouseout, bind

const fadeHandler = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// nav.addEventListener('mouseover', function (e) {
//   fadeHandler(e, '0.5');
// }); // в колбэк функцию нельзя передать аргументы, поэтому создаем колбэк функцию в которой уже вызываем функцию с аргументами. Но это плохой способ

// Passing "argument" into Handler
nav.addEventListener('mouseover', fadeHandler.bind(0.5)); // используя bind мы задаем дополнительный "аргумент" в колбэк функцию, через this, потому что настоящий аргумент в eventHandler может быть только один - event
nav.addEventListener('mouseout', fadeHandler.bind(1));
// если бы нам нужно было несколько "аргументов", то мы бы могли через bind задать this массив или обьект с множеством значений

// Sticky navigation
// https://learn.javascript.ru/coordinates
// getBoundingClientRect
// scroll

// плохой медленный способ, потому что scroll постоянно запускается при малейшем перемещении страницы
/* window.addEventListener('scroll', function () {
  console.log(window.scrollY);

  if (window.scrollY > initialCoords.top)
    nav.classList.add(
      'sticky'
    ); // если координаты нашего скрола по вертикали больше чем положение top нашей секции, то добавить класс sticky (который закрепит меню)
  else nav.classList.remove('sticky'); // если нет - удалить
}); */

// Sticky navigation: Intersection Observer API

/* const obsCallBack = function (entries, observer) {
  entries.forEach(entry => {
    console.log(entry);
  });
};
const obsOptions = {
  root: null,
  threshold: 0.1, // когда 10% section1 видно в viewport - выполнять колбэк 
};

const observer = new IntersectionObserver(obsCallBack, obsOptions);
observer.observe(section1); */
// ---
const navHight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries; // тоже самое что и const entry = entries[0];
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null, // viewport
  threshold: 0, // когда 0% header будет видно - выполняй колбэк
  rootMargin: `-${navHight}px`, // на сколько пикселей раньше/позже будет заканчиваться target element, в нашем случае мы хотим что бы колбэк выполнился за 90 пикселей не до ходя до конца header-а (высота берется динамически)
});
headerObserver.observe(header); // следим за элементом header

// Reveal sections
const sections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries; // entries - это массив из двух элементов - 0-вой - там где все нужные значения, 1-ый - length, поэтому берем 0-вый элемент массива себе в переменную

  if (!entry.isIntersecting) return; // если секция не пересекается с viewport - выйти из функции
  entry.target.classList.remove('section--hidden'); // убрать из нужной секции(которая сейчас таргет) класс хидден
  observer.unobserve(entry.target); // - после того как мы сделали что хотели - можно убрать обсервер с текущего section, что бы после того как всё появилось при пролистовании, обсервер дальше не работал
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15, // заупстить колбэк только когда будет пересечение на 15%
});

sections.forEach(section => {
  // пройтись по всем sections
  sectionObserver.observe(section); // включить на каждую секцию наш intersectionObserver
  // section.classList.add('section--hidden'); // спрятать все sections(что бы они красиво появились с помощью intersectionObserver)
});

// Lazy loading Images
const imgTargets = document.querySelectorAll('img[data-src]'); //  выбрать все картинки(элементы с атрибутом img) внутри которых есть класс data-src

const loadImages = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src; // присваиваем ссылку на изображение с хорошим качеством

  entry.target.addEventListener('load', function () {
    // добавляем eventHandler на текущую картинку, на тригер - load, который выполнит колбэк, когда эта картинка полность загрузится
    entry.target.classList.remove('lazy-img'); // удаляем фильтр blur на текущем элементе только когда наша картинка с хорошим качеством полностью загрузится, иначе будет картинка с плохим качеством без фильтра
    observer.unobserve(entry.target); // с картинкой сделали что хотели, можно перестать обзёрвить
  });
};

const imageObserver = new IntersectionObserver(loadImages, {
  root: null,
  threshold: 0,
  rootMargin: `200px`, // что бы картинки загружались в хорошем качестве за 200 пикселей до того, как до них долистаем
});

imgTargets.forEach(img => {
  imageObserver.observe(img);
});

// SLIDER
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  let curSlide = 0;
  const maxSlide = slides.length;
  const dotContainer = document.querySelector('.dots');

  // Functions
  // DOTS
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>` // вставляем html точек (столько штук, сколько у нас слайдов)
      );
    });
  };
  const activateDots = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active'); // выбираем нужную точку в которой data-slide = curSlide
  };

  const goToSlide = function (slide) {
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (i - slide)}%)`; // сдвигаем все слайды на 100% влево, для этого currentSlide назначаем на 1, и отнимаем от текущего расположения слайдов значение curSlide(потом всё это умножаем на 100%), итого при каждом клике curSlide будет увеличиваться и изображения будут двигаться правильно
    });
  };

  // Next Slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      // если дошли до последнего слайда, вернуться к первому
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSlide(curSlide);
    activateDots(curSlide);
  };
  const prevSlide = function () {
    if (curSlide === 0) {
      // если дошли до последнего слайда, вернуться к первому
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDots(curSlide);
  };

  const init = function () {
    goToSlide(curSlide);
    createDots();
    activateDots(curSlide);
  };
  init();

  // event Handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    console.log(e); // в консоли мы можем понажимать на кнопки и увидеть как каждая кнопка называется
    if (e.key === 'ArrowRight') nextSlide();
    e.key === 'ArrowLeft' && prevSlide(); // тоже самое что и сверху (shortcircuting)
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const slide = e.target.dataset.slide; // берем slide из data атрибутов, которые мы задали (от 0 до 3)
      goToSlide(slide); // функция отлично работает, если давать ей текущий номер, куда мы хотим перейти
      activateDots(slide);
    }
  });
};
slider();

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
/* 

console.log(document.documentElement); // выбираем весь документ (querySelector для базовых элементов не нужен)
console.log(document.head); // выбираем элемент head
console.log(document.body); // выбираем элемент body
//---
console.log(document.querySelector('.header')); // выбираем элемент header (первый элемент header в документе)
console.log(document.querySelectorAll('.section')); // выбираем все элементы с класом section в NodeList

console.log(document.getElementById('section--1'));
console.log(document.getElementsByTagName('button')); // выбираем все элементы с тэгом button в HTMLCollection

console.log(document.getElementsByClassName('btn')); // HTMLCollection(5) [button.btn.operations__tab.operations__tab--1.operations__tab--active, button.btn.operations__tab.operations__tab--2, button.btn.operations__tab.operations__tab--3, button.btn.btn--show-modal, button.btn]

const message = document.createElement('div'); // Создаем элемент с тэгом div и присваиваем его в переменную. Этот элемент пока ещё не находится в документе
message.classList.add('cookie-message'); // добавляем в DOM элемент класс
// message.textContent = 'We use cookies for improved functionality and analytics'; // вставляем тест в наш элемент
message.innerHTML = `We use cookies for improved functionality and analytics <button class="btn btn--close-cookie">Got it!</button>`; // а можно вставить HTML в наш элемент
/* 
// header.prepend(message); // А вот теперь мы уже вставляем наш дом элемент в документ. (Вставляем в элемент header первым childElement c помощью prepend)
// header.append(message); // перемещаем (а не вставляем ещё один) наш DOM элемент последним childElement в header с помощью append.  Перемещаем потому что DOM element - уникален, и он уже был создан и помещен в документ в DOM Tree, он не может быть сразу в двух местах одновременно.

// header.append(message.cloneNode(true)) // А вот таким образом мы сделали глубокую копию элемента (с помощью метода cloneNode, в котором указали true - что бы клонировало и childElements) и вставили его копию в конце элемента header 
header.before(message); // а с помощью before мы можем вставить наш элемент действительно перед элементом header - братом, а не ребенком
header.after(message); // с помощью after вставляем наш элемент после элемента header опять же они будут siblings

// deleting element c помощью remove
document
  .querySelector('.btn--close-cookie') // выбрали кнопку в элементе message
  .addEventListener('click', function () {
    // создали на неё eventListener на клик по этой кнопке
    message.remove(); // при клике весь элемент message будет удален
  });
console.log('b', 'a', 'a', 'a');

//Styles
message.style.backgroundColor = '#37383d'; // задаем напрямую стиль в элемент
message.style.width = '120%';

console.log(message.style.color); // <empty string> - нельзя таким образом получить стиль из css, который напрямую не указан в html
console.log(message.style.backgroundColor); // rgb(55, 56, 61) - а если указан то можно

//getComputedStyle -
console.log(getComputedStyle(message).color); // rgb(187, 187, 187) - а так можно получить стиль из css
console.log(getComputedStyle(message).height); // 50.3px

message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px'; // получаем стиль height элемента message, вынимаем из него только цифры с Number.parseFloat и увеличиваем значение не забывая что нужно добавить 'px', так как запись должны быть как в css

// setProperty
document.documentElement.style.setProperty('--color-primary', 'orangered'); // задали на весь документ свойтво --color-primary значение orangered

// Attributes

const logo = document.querySelector('.nav__logo');
console.log(logo.alt); // Bankist logo -  получили атрибут элемента alt
console.log(logo.src); // http://127.0.0.1:8080/img/logo.png - полный адресс logo
console.log(logo.className); // nav__logo  - получили класс (className == class, просто так называется по историческим причинам)

logo.alt = 'Beautiful minimalist logo'; // изменили значение атрибута alt

// Non-standard attributes
console.log(logo.designer); // undefined  - нельзя таким образом получить нестандартные аттрибуты, даже если они прописаны в html

// getAttribute - возвращает значение нестандартного аттрибута элемента (стандартного тоже)
// https://developer.mozilla.org/ru/docs/Web/API/Element/getAttribute
// getAttribute() возвращает значение указанного атрибута элемента. Если элемент не содержит данный атрибут, могут быть возвращены null или "" (пустая строка); подробнее Notes.

console.log(logo.getAttribute('designer')); // Jonas  - а так можно, если не существует вернет - null

// setAttribute - мы так же можем задать значение нестандартного аттрибута (и стандартного тоже)
// https://developer.mozilla.org/ru/docs/Web/API/Element/setAttribute
// Добавляет новый атрибут или изменяет значение существующего атрибута у выбранного элемента.
logo.setAttribute('company', 'Bankist'); // задали атрибут в элемент logo с именем company и значением Bankist

console.log(logo.getAttribute('src')); // img/logo.png - если мы хотим получить относительный путь, который указан в html а не полный путь то нужно использовать getAttribute

const link = document.querySelector('.twitter-link');
console.log(link.getAttribute('href')); // https://twitter.com/jonasschmedtman  - так же можем получить путь href из html(в данном случае он обсалютный но может быть и относительный)

const linkInButton = document.querySelector('.nav__link--btn');
console.log(linkInButton.href); // http://127.0.0.1:8080/#  - абсолютный путь
console.log(linkInButton.getAttribute('href')); // #  - относительный путь, указанный в html

/*  Data attributes
 https://developer.mozilla.org/ru/docs/Learn/HTML/Howto/Use_data_attributes
  data-* атрибуты позволяют хранить дополнительную информацию в стандартных элементах HTML, без хаков вроде нестандартных атрибутов, лишних DOM-свойств или Node.setUserData().
 Синтаксис прост — любой атрибут, чьё имя начинается с data-, является data-* атрибутом.
<article
  id="electriccars"
  data-columns="3"
  data-index-number="12314"
  data-parent="cars">
...
</article>
Чтение data-атрибутов в JavaScript осуществляется также просто. Для этого можно использовать метод getAttribute() с параметром, равным полному имени атрибута. Но есть и более простой способ, используя объект dataset (en-US).
Чтобы получить data-атрибут можно взять свойство объекта dataset с именем, равным части имени атрибута после data- (обратите внимание, что дефисы в имени преобразуются в camelCase). 
var article = document.getElementById('electriccars');
article.dataset.columns // "3"
article.dataset.indexNumber // "12314"
article.dataset.parent // "cars"
///////

console.log(logo.getAttribute('data-version-number')); // 3 - можно использовать getAttribute, но лучше dataset
console.log(logo.dataset.versionNumber); // 3 - в html этот аттрибут называется data-version-number - все data* аттрибуты мы можем вытаскивать из dataset задавая имя аттрибута - всё что после data  в camelCase

// Classes
//classList
// https://developer.mozilla.org/ru/docs/Web/API/Element/classList
// Свойство classList возвращает псевдомассив DOMTokenList, содержащий все классы элемента.

console.log(logo.classList); // DOMTokenList [ "nav__logo" ] 0: "nav__logo" 1: "c" length: 2 value: "nav__logo c"
logo.classList.add('c', 'j'); // добавляем классы c и j в элемент logo
logo.classList.remove('c','j'); // удаляем классы из элементы logo
logo.classList.toggle('c') // - если класса c нету в элементе logo - добавит его, если есть - удалит
logo.classList.contains('c'); // - вернет true, если в элементе logo есть класс с, false - если нет (не путать с includes)

//Don't use
// logo.className = 'jonas' // можно задать класс и таким образом через className, но не нужно это использовать, так как это затирает все остальные классы, и так можно задать только один класс, нужно использовать для задания классов только classList.add */

/////////////

// Справочник по событиям
// https://developer.mozilla.org/ru/docs/Web/Events
/*
const h1 = document.querySelector('h1');

const h1Alert = function (e) {
  alert('addEventListener: Great, you are havering over heading');

  // h1.removeEventListener('mouseenter', h1Alert) // удаляем eventListener внутри функции, которую мы поставим внутрь addEventListener - это приведет к тому что функция один раз выполнится и всё, больше выполнятся не будет
};

h1.addEventListener('mouseenter', h1Alert);

setTimeout(() => h1.removeEventListener('mouseenter', h1Alert), 3000); // удалить EventListener можно и позже, например в setTimeout - в данном случае EventListener будет работать только первые 3 секунды после перезагрузки страницы - а потом работать не будет(ни одного раза не выполнится)

h1.onmousenter = function (e) {
  console.log('addEventListener: Great, you are havering over heading');
}; // тоже самое что и с addEventListener, только уже oldschool, сейчас обычно используется только eddEventListener
// addEventListener лучше потому что на него можно ставить несколько event-ов и они все будут исполнятся, в то время как on... event-ы будут затираться сверху последним. И мы также можем удалить в addEventListener event, если он нам больше не нужен, в отличии от on...

// <h1 onclick="alert('HTML Alert')"> - и последний способ добавлять eventListeners - в самом HTML - так делать не нужно по тем же причинам, что и onmouseenter, onclick в самом js + плохая практика
// </h1>

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;
console.log(randomColor());

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor(); // this в eventhandler указывает на элемент (document.querySelector('.nav__link'))
  console.log('Link', e.target); // Link  <a class="nav__link" href="#" style="background-color: rgb(209, 52, 193);"> - во всех трех случаях e.target будет один и тот же - event по которому был совершен клик, и во всех трех случаях "e" в функциях будет одна и таже - event элемента на котором был произведён клик.
  console.log(e.currentTarget); // <a class="nav__link" href="#" style="background-color: rgb(209, 52, 193);">  - текущий элемент, вне зависимости от того, где было совершенно действие
  console.log(this === e.currentTarget); // true  - this  и e. currentTarget - будет одним и тем же в любом eventHandler

  // STOP PROPAGATION (остановить распространение на родителей)
  // e.stopPropagation(); // распространение полностью остановлено - eventHandler-ы не будут выполнены в .nav__links и в .nav  (лучше не использовать)
}); // при нажатии на этот линк - будет отработан eventhendler этот, родительский (.nav_links), и старший родительский (.nav). И были бы отработаны все hendler-ы в более старших родителях, если бы на них были eventListener

document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('Container', e.target); // Container  <a class="nav__link" href="#" style="background-color: rgb(209, 52, 193);">  - e из Link, по которому было совершенно действие
  console.log(e.currentTarget); // <ul class="nav__links" style="background-color: rgb(202, 75, 96);">  - а это уже будет текущий элемент
}); // при нажатии на этот блок - будет обратботан этот элемент и родительский (.nav), ребенок обработан не будет

document.querySelector('.nav').addEventListener(
  'click',
  function (e) {
    this.style.backgroundColor = randomColor();
    console.log('Nav', e.target); // Nav   <a class="nav__link" href="#" style="background-color: rgb(209, 52, 193);">  - элемент по которому было совершенно действие
    console.log(e.currentTarget); // <nav class="nav" style="background-color: rgb(147, 9, 231);">  - текущий элемент
    console.log(this === e.currentTarget); // true  - this  и e. currentTarget - будет одним и тем же в любом eventHandler
  },
  true //(почти не используется в наши дни) если задать этот необязательный параметр в EventListener на true - то eventListener будет срабатывать на первой фазе (capturing phase), пока event бежит от root до target element, а не на третьей фазе всплытия (bubling phase) - как работает по дефолту
); // при нажатии на этот блок - будет обработан только он - потому что у его родителей нет eventhedler-ов, а дети не обрабатываются при клике по родителям

*/
/*
// ### DOM Traversing
const h1 = document.querySelector('h1');

// Going downwards: child

// querySelector от элемента
console.log(h1.querySelectorAll('.highlight')); // NodeList [ span.highlight, span.highlight ] - в данном случае это прямые дети у h1, но этот метод работает на любую глубину (выбрались только элементы с классом highlight, которые были "под" h1 элементом)
// .childNodes
console.log(h1.childNodes); // NodeList(9) [ #text, <!--  Green highlight effect  -->, #text, span.highlight, #text, br, #text, span.highlight, #text ]  - выводит ВСЕХ детей в NodeList, и текст и коментирии и тэги с классами. Пробелы в верстке - это тоже текст.
// Из-за этого childNodes не часто используется
// .children
console.log(h1.children); // HTMLCollection { 0: span.highlight, 1: br, 2: span.highlight, length: 3 } - возвращает только элементы внутри h1, в HTMLCollection - который live обновляется. Поэтому .children используется гораздо чаще. - но этот метод работает только для direct children, он не зайдёт вглубь
// firestElementChild, lastElementChild
h1.firstElementChild.style.color = 'white'; // выбираем и сразу задаем стиль первому элементу-ребенку h1
h1.lastElementChild.style.color = 'orangered'; // и последнему ребенку h1

// Going upwards: parents

// .parentNode
console.log(h1.parentNode); // <div class="header__title"> - выбираем Node родителя h1
// .parentElement
console.log(h1.parentElement); // <div class="header__title"> - выбираем Element родителя h1 - чаще всего используем именно этот метод (в данном случае Node и Element одно и тоже)
// Element.closest()
// - Метод Element.closest() возвращает ближайший родительский элемент (или сам элемент), который соответствует заданному CSS-селектору
// - https://developer.mozilla.org/ru/docs/Web/API/Element/closest
// closest - противоположность querySelector, querySelector - ищет детей вне зависимости от того как глубоко они, а closest ищет предков вне зависимости как далеко они
console.log(h1.closest('.header')); // <header class="header">
h1.closest('.header').style.background = 'var(--gradient-secondary)';
h1.closest('h1'); // вернёт сам себя, потому что он и является самый ближайшим элементом с тэгом h1

// Going sideways: siblings

// .previousElementSibling, nextElementSibling
console.log(h1.previousElementSibling); // null  - в родительском div-е наш h1 стоит первым - поэтому до него никого нет
console.log(h1.nextElementSibling); // <h4> - идет после нашего h1

// previousSibling, nextSibling - показывает предыдущий или следующий узлы вокруг нашего элемента (обычно текст будет)
console.log(h1.previousSibling); // #text "\n        "  - предыдущий node
console.log(h1.nextSibling); // #text "\n        " - следующий node

// если нужны все siblings:
console.log(h1.parentElement.children); // HTMLCollection { 0: h1, 1: h4, 2: button.btn--text.btn--scroll-to, 3: img.header__img, length: 4 }  - подымаемся на уровен к родителю и смотрим всех его детей - узнаем всех siblings включая себя
[...h1.parentElement.children].forEach(function (el) {
  if (el !== h1) el.style.transform = 'scale(0.5)'; // уменьшили все братские элементы (кроме самого себя) в 2 раза
});
*/
//DOMContentLoaded
document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML fully loaded and DOM Tree built', e);
}); // не нужно обарачивать весь код в эту функцию, если загрузка js в html стоит вкноце, потому что и так будет всё загруженно
window.addEventListener('load', function (e) {
  console.log('Page fully loaded(all css and images too)', e);
});
// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = ''; // когда пользователь будет закрывать нашу вкладку - браузер спросит уверен ли он(использовать только если пользователь заполняет важную информацию и может потерять прогресс при закрытии вкладки)
// });
