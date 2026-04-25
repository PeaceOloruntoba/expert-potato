import { ImageSourcePropType } from "react-native";

// Images
import logo from "./images/logo.png";
import onboard1 from "./illustrations/onboard-1.png";
import onboard2 from "./illustrations/onboard-2.png";
import onboard3 from "./illustrations/onboard-3.png";
import onboard4 from "./illustrations/onboard-4.png";
import farmerIcon from "./icons/farmer.jpeg";
import staffIcon from "./icons/staff.jpeg";
import vetIcon from "./icons/vet.jpeg";
import feedBatchIcon from "./icons/feed_batches.png";
import feedIcon from "./icons/feed.png";
import medicineIcon from "./icons/medicine.png";
import salesIcon from "./icons/sales.png";
import warningIcon from "./icons/warning.png";
import waterIcon from "./icons/water.png";
import tankIcon from "./icons/water_tank.png";
import feedStockIcon from "./icons/feed_stock.png";
import stockCheckIcon from "./icons/stock_check.png";
import sickBirdIcon from "./icons/sick_bird.png";
import recoveryIcon from "./icons/recovery.png";
import eggIcon from "./icons/egg.png";
import eggStoreIcon from "./icons/egg_store.png";
import waterCheckIcon from "./icons/water_check.png";
import eggSale from "./icons/egg_sale.png";
import litterIcon from "./icons/litter.png";
import cleanIcon from "./icons/check_clean.png";
import consumer from "./icons/consumer_data.png";
import tempRecord from "./icons/temperature.png";
import weeklyFinancial from "./icons/weekly_financial.png";
import financial from "./icons/financial.png";
import birdStock from "./icons/bird_stock.png";

export type AssetImage = ImageSourcePropType;

export const Images = {
  logo,
  onboarding: [onboard1, onboard2, onboard3, onboard4] as AssetImage[],
  farmerIcon,
  staffIcon,
  vetIcon,
  feedBatchIcon,
  feedIcon,
  medicineIcon,
  salesIcon,
  warningIcon,
  waterIcon,
  tankIcon,
  feedStockIcon,
  stockCheckIcon,
  sickBirdIcon,
  recoveryIcon,
  eggIcon,
  eggStoreIcon,
  waterCheckIcon,
  eggSale,
  litterIcon,
  cleanIcon,
  consumer,
  tempRecord,
  weeklyFinancial,
  financial,
  birdStock,
};

export type OnboardingSlide = {
  image: AssetImage;
  title: string;
  subtitle: string;
};

export const OnboardingSlides: OnboardingSlide[] = [
  {
    image: onboard1,
    title: "Track Everything Easily",
    subtitle: "Monitor your farm activities, feed, health, and production, in one place.",
  },
  {
    image: onboard2,
    title: "Connect with Experts",
    subtitle: "Find and chat with verified veterinarians, suppliers, and farm professionals nearby.",
  },
  {
    image: onboard3,
    title: "Make Smater Decisions",
    subtitle: "Turn your daily records into powerful insights that grow your business.",
  },
  {
    image: onboard4,
    title: "Access our farm LMS",
    subtitle: "Train your team with ease with our Learning management systems",
  },
];
