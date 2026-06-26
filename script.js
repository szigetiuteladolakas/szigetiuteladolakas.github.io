const englishCopy = {
  navGallery: "Gallery",
  navContact: "Contact",
  eyebrow: "Pécs • Egyetemváros",
  heroTitle: "A bright, modern apartment in one of Pécs's convenient neighbourhoods",
  viewPhotos: "View photos",
  emailUs: "Send email",
  contactLabel: "Owner",
  detailsEyebrow: "Overview",
  descriptionTitle: "Short apartment description",
  descriptionOne: `For sale: a bright ground-floor brick apartment built in 2019, located in the University District of Pécs, with private garden area and a designated parking space in the inner courtyard.

The apartment has a total floor area of 45 m² and consists of an entrance hall, a living room, a separate bedroom, a kitchen, and a bathroom with toilet. The property is in very good condition, having been continuously maintained, with several aesthetic and comfort upgrades carried out in recent years.

Comfort is ensured by an efficient gas heating system and a heating and cooling air-conditioning unit. Solid brick masonry construction, insulated building features high-quality plastic-framed windows fitted with shutters and mosquito screens. The apartment includes a 20 m² private garden for exclusive use, as well as a designated parking space in the secured inner courtyard, accessed via an electric gate.

All built-in furniture and kitchen appliances are included in the purchase price. Additional furnishings may be available upon agreement.

The location is highly convenient, both the Faculty of Medicine and the Faculty of Humanities and Social Sciences of the University of Pécs are approximately a 10-minute walk away. The surrounding area offers a wide range of amenities, including supermarkets, pharmacies, medical and veterinary services, drugstores, markets, restaurants, gyms, and various shops. Public transport is easily accessible, with several bus stops and the Uránváros bus terminal within a few minutes walk.

Situated in a quiet and well-maintained residential environment, the apartment is an ideal choice for young professionals, university students, couples or investors. Thanks to its location, it also offers excellent long-term rental potential.

The property is being sold by its first owner, free of any mortgage, liens, usufruct rights or third-party claims, short-term availability for move-in.`,
  photosEyebrow: "Photos",
  galleryTitle: "Gallery"
};

const languageButtons = document.querySelectorAll("[data-lang-target]");
const translatedElements = document.querySelectorAll("[data-i18n]");
const galleryItems = Array.from(document.querySelectorAll(".gallery-item"));
const lightbox = document.querySelector(".lightbox");
const lightboxImage = document.querySelector(".lightbox-image");
const lightboxCaption = document.querySelector(".lightbox-caption");
const closeButton = document.querySelector(".lightbox-close");
const previousButton = document.querySelector(".lightbox-arrow.previous");
const nextButton = document.querySelector(".lightbox-arrow.next");

const hungarianCopy = {};

translatedElements.forEach((element) => {
  hungarianCopy[element.dataset.i18n] = element.textContent;
});

const labels = {
  hu: {
    photo: "Lakásfotó",
    close: "Bezárás",
    previous: "Előző fotó",
    next: "Következő fotó"
  },
  en: {
    photo: "Apartment photo",
    close: "Close",
    previous: "Previous photo",
    next: "Next photo"
  }
};

let currentLanguage = "hu";
let activeImageIndex = 0;

function setLanguage(language) {
  const selectedCopy = language === "en" ? englishCopy : hungarianCopy;
  currentLanguage = language;
  document.documentElement.lang = language;

  translatedElements.forEach((element) => {
    const key = element.dataset.i18n;

    if (selectedCopy[key] != null) {
      element.textContent = selectedCopy[key];
    }
  });

  languageButtons.forEach((button) => {
    const isActive = button.dataset.langTarget === language;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  galleryItems.forEach((item, index) => {
    const image = item.querySelector("img");
    image.alt = `${labels[language].photo} ${index + 1}`;
  });

  closeButton.setAttribute("aria-label", labels[language].close);
  previousButton.setAttribute("aria-label", labels[language].previous);
  nextButton.setAttribute("aria-label", labels[language].next);

  if (lightbox.classList.contains("is-open")) {
    updateLightbox(activeImageIndex);
  }
}

function updateLightbox(index) {
  activeImageIndex = (index + galleryItems.length) % galleryItems.length;
  const item = galleryItems[activeImageIndex];
  const imagePath = item.dataset.image;
  const photoNumber = item.dataset.index;

  lightboxImage.src = imagePath;
  lightboxImage.alt = `${labels[currentLanguage].photo} ${photoNumber}`;
  lightboxCaption.textContent = `${labels[currentLanguage].photo} ${photoNumber} / ${galleryItems.length}`;
}

function openLightbox(index) {
  updateLightbox(index);
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("lightbox-open");
  closeButton.focus();
}

function closeLightbox() {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("lightbox-open");
  galleryItems[activeImageIndex].focus();
}

languageButtons.forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.langTarget));
});

galleryItems.forEach((item, index) => {
  item.addEventListener("click", () => openLightbox(index));
});

closeButton.addEventListener("click", closeLightbox);
previousButton.addEventListener("click", () => updateLightbox(activeImageIndex - 1));
nextButton.addEventListener("click", () => updateLightbox(activeImageIndex + 1));

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (!lightbox.classList.contains("is-open")) {
    return;
  }

  if (event.key === "Escape") {
    closeLightbox();
  }

  if (event.key === "ArrowLeft") {
    updateLightbox(activeImageIndex - 1);
  }

  if (event.key === "ArrowRight") {
    updateLightbox(activeImageIndex + 1);
  }
});

setLanguage("hu");
