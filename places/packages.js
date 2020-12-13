var dbConfig=require('../database/dbConfig');
dbConfig.connect(function (error) {
    if (error) {
        console.log('unable to connect')
    } else {
        console.log('connected successfully')
        dbConfig.get().collection('abc').insertMany([{
            imagePath: "https://wallpapercave.com/wp/wp1922510.jpg",
            place: 'Bulgaria',
            price: '1500',
            description1: 'the largest national economy in Europe',
            description2: '11 nights and 12 days'
        }, {
            imagePath: "https://wallpapershome.com/images/pages/pic_h/4633.jpg",
            place: 'Germany',
            price: '1500',
            description1: 'the largest national economy in Europe',
            description2: '11 nights and 12 days'
        }, {
            imagePath: "https://www.expatica.com/app/uploads/sites/9/2017/07/cost-of-living-in-switzerland.jpg",
            place: 'Switzerland',
            price: '1500',
            description1: 'It s tough to find a place not to like in Switzerland',
            description2: '11 nights and 12 days'
        }, {
            imagePath: "https://www.discoverchina.com/uploads/photo-1493221875746-1203de4f7a56.jpg",
            place: 'China',
            price: '1500',
            description1: ' China was the fourth most visited country in the world',
            description2: '11 nights and 12 days'
        }, {
            imagePath: "https://www.newzealand.com/assets/Tourism-NZ/Fiordland/img-1536137761-110-7749-p-7ECF7092-95BD-FE18-6D4107E2E42D067E-2544003__aWxvdmVrZWxseQo_FocalPointCropWzQyNyw2NDAsNTAsNTAsODUsImpwZyIsNjUsMi41XQ.jpg",
            place: 'Australia & new zealand',
            price: '1500',
            description1: 'kiwis & kangaroos',
            description2: '11 nights and 12 days'
        },
            {
                imagePath:"https://www.tripsavvy.com/thmb/rvAsp3a9LGPqpfAzZqlnrNT1GW8=/950x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/Statue-liberty-56b008a15f9b58b7d01f9e4e.jpg",
                place:'U.S.A',
                price:'2000',
                description1:"land of economy",
                description2:'11 nights and 12 days'

            }
            ,
            {
                imagePath:"https://image.kesari.in/upload/UC/niagara_falls.jpg",
                place:"canada",
                price:"2100",
                description1:"The land of Niagara Falls" ,
                description2:'11 nights and 12 days'

            }

            ,
            {
                imagePath:"https://www.touropia.com/gfx/d/famous-domes/saint_basils_cathedral.jpg?v=738987d995522a0004717158cbe59a15",
                place:"russia",
                price:'1900',
                description1: "the land of artists",
                description2:'11 nights and 12 days'

            }


        ])
    }
})
