export type Item = {
  id: string; name: string; price: number; icon: string; label: string; desc: string; img?: string;
};

export const BEVERAGES: Item[] = [
  { id: "bev4",  name: "Thums Up",              price: 50,  icon: "🥤", label: "₹50",  desc: "Classic strong cola — Thums Up.", img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781540839/thums_up_cbez4j.jpg" },
  { id: "bev5",  name: "Sprite",                price: 50,  icon: "🥤", label: "₹50",  desc: "Refreshing lemon-lime Sprite.", img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781540838/sprite_fbku0t.jpg" },
  { id: "bev6",  name: "Slice Mango",           price: 55,  icon: "🥭", label: "₹55",  desc: "Slice Pure Mango Pleasure drink.", img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781540838/slice_pure_mango_pleasure_m98k3d.jpg" },
  { id: "bev8",  name: "Mountain Dew",          price: 50,  icon: "🍋", label: "₹50",  desc: "Mountain Dew — citrus rush.", img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781540836/mountain_dew_myfodi.jpg" },
  { id: "bev9",  name: "Monster Energy",        price: 120, icon: "⚡", label: "₹120", desc: "Monster Energy — boost your gameplay.", img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781540835/monster_energy_inhptz.jpg" },
  { id: "bev12", name: "Maaza Mango",           price: 55,  icon: "🥭", label: "₹55",  desc: "Maaza — the real mango drink.", img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781540833/maaza_qlb0cy.jpg" },
  { id: "bev13", name: "Minute Maid Orange",    price: 55,  icon: "🍊", label: "₹55",  desc: "Minute Maid Pulpy Orange juice.", img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781540832/minute_maid_pulpy_orange_yjgtxq.jpg" },
  { id: "bev14", name: "Coca-Cola",             price: 50,  icon: "🥤", label: "₹50",  desc: "The original Coca-Cola.", img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781540831/coca_cola_gd5nsn.jpg" },
  { id: "bev15", name: "Limca",                 price: 50,  icon: "🍋", label: "₹50",  desc: "Limca — lemony refreshing fizz.", img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781540832/limca_jps5rr.jpg" },
  { id: "bev20", name: "Red Bull",              price: 150, icon: "🐂", label: "₹150", desc: "Red Bull Energy Drink — wings for your game.", img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781809303/redbull_vj6ucz.png" },
];

export const SNACKS: Item[] = [
  { id: "sn1",  name: "Lays Hot & Sweet Chilli", price: 30, icon: "🌶️", label: "₹30", desc: "Lays Hot & Sweet Chilli flavour crisps.", img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781541666/lays_hot_and_sweet_chilli_la7c19.jpg" },
  { id: "sn2",  name: "Lays Cream & Onion",      price: 30, icon: "🧅", label: "₹30", desc: "Lays Cream & Onion — a classic favourite.", img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781541664/lays_cream_and_onion_i26ekr.jpg" },
  { id: "sn3",  name: "Lays Chile Limon",        price: 30, icon: "🍋", label: "₹30", desc: "Lays Chile Limon — tangy and spicy.", img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781541662/lays_chile_limon_zga8yi.jpg" },
  { id: "sn4",  name: "Kurkure Puffcorn",        price: 30, icon: "🍿", label: "₹30", desc: "Kurkure Playz Puffcorn — light and crunchy.", img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781541661/kurkure_playz_puffcorn_plkiex.jpg" },
  { id: "sn5",  name: "Kurkure Masala Munch",    price: 30, icon: "🌶️", label: "₹30", desc: "Kurkure Masala Munch — bold Indian spices.", img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781541659/kurkure_masala_munch_bjtdae.jpg" },
  { id: "sn6",  name: "Doritos Sweet Chilli",    price: 50, icon: "🌶️", label: "₹50", desc: "Doritos Sweet Chilli — bold triangle chips.", img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781541652/doritos_sweet_chilli_wrlnmq.jpg" },
  { id: "sn7",  name: "Doritos Nacho Cheese",    price: 50, icon: "🧀", label: "₹50", desc: "Doritos Nacho Cheese — cheesy crunch.", img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781541651/doritos_nacho_cheese_on1jh6.jpg" },
  { id: "sn8",  name: "Lays Chilli",              price: 30, icon: "🌶️", label: "₹30", desc: "Lays Chilli — fiery crunch.", img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781715362/Lays_Chilli_aocqrq.png" },
  { id: "sn9",  name: "Doritos Cool Ranch",      price: 50, icon: "🤠", label: "₹50", desc: "Doritos Cool Ranch — cool & creamy.", img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781541650/doritos_cool_ranch_ojwo5v.jpg" },
  { id: "sn10", name: "Lays Blue",               price: 30, icon: "🥔", label: "₹30", desc: "Lays Blue — classic salted chips.", img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781715360/Lays_Blue_rfsslg.png" },
  { id: "sn11", name: "Kurkure Naughty Tomato",  price: 30, icon: "🍅", label: "₹30", desc: "Kurkure Naughty Tomato — tangy twist.", img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781715359/Kurkure_Naughty_Tomato_xhslqv.png" },
  { id: "sn12", name: "Kurkure Green Chilli",    price: 30, icon: "🫑", label: "₹30", desc: "Kurkure Green Chilli — bold spicy crunch.", img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781715359/Kurkure_Green_Chilli_brhr3o.png" },
  { id: "sn13", name: "Cheetos Flamin Hot",      price: 30, icon: "🔥", label: "₹30", desc: "Cheetos Flamin Hot — intense fiery crunch.", img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781809221/cheetos_flamin_hot_risrtv.png" },
  { id: "sn14", name: "Cheetos Puff",            price: 30, icon: "🧡", label: "₹30", desc: "Cheetos Puff — light, airy cheesy puffs.", img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781809221/cheetos_puff_se2wru.png" },
  { id: "sn15", name: "Cheetos Masala Balls",    price: 30, icon: "🌶️", label: "₹30", desc: "Cheetos Masala Balls — spicy round bites.", img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781809221/cheetos_masala_balls_m8aesm.png" },
  { id: "sn16", name: "Kurkure Green Chutney",   price: 30, icon: "🌿", label: "₹30", desc: "Kurkure Green Chutney — tangy herby crunch.", img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781809221/kurkure_green_chutne_yvi36o.png" },
  { id: "sn17", name: "Cheetos Cheez Puf",       price: 30, icon: "🧀", label: "₹30", desc: "Cheetos Cheez Puf — classic cheesy snack.", img: "https://res.cloudinary.com/dxvui0xkz/image/upload/v1781809220/cheetos_cheez_puf_xmkclu.png" },
];

export const CATEGORIES = {
  beverages: { key: "beverages", title: "Beverages", icon: "🥤", items: BEVERAGES,
    blurb: "Juices, colas, energy drinks & more — chilled and ready." },
  snacks:    { key: "snacks",    title: "Snacks",    icon: "🍿", items: SNACKS,
    blurb: "Chips, crisps & crunchy munchies to fuel your session." },
} as const;

export type CategoryKey = keyof typeof CATEGORIES;
