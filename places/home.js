var dbConfig=require('../database/dbConfig');
dbConfig.connect(function (error) {
    if (error) {
        console.log('unable to connect')
    } else {
        console.log('connected successfully')
        dbConfig.get().collection('hellosi').insertMany([
            {
                photo:"https://i.pinimg.com/originals/7f/a7/bb/7fa7bb83f07e1eb17e768b3d6dabbef7.jpg"
            },
            {
                photo:"https://wallpapershome.com/images/pages/pic_h/4633.jpg"
            },
            {
                photo:"https://wallpapercave.com/wp/wp1922510.jpg"
            }
        ])
    }
})
