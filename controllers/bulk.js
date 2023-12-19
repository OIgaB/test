
// import fs from 'fs/promises';
// import path from 'path';
// // import Jimp from "jimp";  //image processing library for Node.js (resizing, cropping, applying filters...)
// import { User } from '../models/user.js';
// import { ctrlWrapper } from '../decorators/index.js';


// const bulkPath = path.resolve("public", "bulk"); // шлях до папки з файлом

// const addBulk = async(req, res) => {
//     const { path: oldPath, filename } = req.file; //  path до temp; filename - нова назва файлу

//     const newPath = path.join(bulkPath, filename); // створюємо новий шлях (до public\avatars) з ім'ям файлу
//     //newPath = C:\Users\Olga\Desktop\GitHub\goit-node.js-hw-02-REST-API-app\public\avatars\1691116545855-256001994_drink.jpg

//     // Jimp.read(oldPath)
//     //     .then(image => {
//     //         return image
//     //         .resize(250, 250) // resize
//     //         // .resize(Jimp.AUTO, 250)  //ширина відповідно
//     //         //.resize(250, Jimp.AUTO)   // висота відповідно
//     //         // .quality(60) // set JPEG quality
//     //         // .greyscale() // чорно-білий знімок
//     //         .write(newPath); // зберігає оброблене зображ. за вказаним маршрутом (до public\avatars), але не видаляє з temp оригінальне
//     //     })
//     //     .catch(err => {
//     //         console.error(err);
//     //     });  

//     await fs.rename(oldPath, newPath); // переміщення файла до public\avatars  (переміщення вже було реалізоване в Jimp), + видалення з temp оригінального

//     const bulkURL = path.join('bulk', filename); // записуємо шлях в body // папку 'public' не пишемо, вона вже вказана в мідлварі в app.js
//     // avatarURL: avatars\1691116849916-469261661_drink.jpg

//     await User.create({ bulkURL }) 


//     res.status(201).json({bulkURL}); // успішно додали контакт на сервер
// }

// export default { 
//     addBulk: ctrlWrapper(addBulk),
// }