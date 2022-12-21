# FILE-UPLOAD

## Ilova haqida

- Fayllarni yuklash va yuklab olish uchun API
- Ilovani tayyorlash uchun express, multer, knex, postgres'dan foydalanilgan.
- fayllar to'liq database'da saqlanadi: arxivlanadi (zip), 256kb chunk'larga bo'linadi, database'ga yoziladi, `GET` qilishda qayta yig'ilib arxivdan ochilib uzatiladi.
- APIs:  
  1.Upload file - `POST`
  2.Download file - `GET`

## Ishga tushurish

- `<your_database_credentials>` - database bilan bog'lanish uchun database parametrlari
- paketlarni o'rnating:
  ```
  $ npm install
  ```
- quyidagi buyruqlar ketma-ketligi yordamida database'da kerakli jadvallarni yarating

  ```
  $ cd db
  $ npx knex migrate:latest
  $ cd ..
  ```

- ekspress serverni ishga tushiring

  ```
  $ npm start
  ```

## Qo'shimcha

- API xavfsizlik jihatdan ochiq
- [Dasturchi bilan bog'lanish](https://t.me/nazirov_web_log)
- izoh:
  - fayllarning hajmini kichraytirish uchun ular arxivlanadi
  - yozish va o'qish jarayonida muammo kelib chiqmasligi uchun fayllar chunk'larga bo'linadi
