export default function (e) {
    var data;
    var gameData;
    var deliveryData;

    // console.log(e.name, e.gameData); // eslint-disable-line no-console

    data = e.gameData;
    // console.log(data);
    // console.log(data); // eslint-disable-line no-console

    if (!data) {
        return;
    }

    /* eslint-disable max-len */
    /* eslint-disable no-exceed-lines */

    if (data.game === 'skribble') {

        if (data.name === 'ready') {
            e.respond({
                name: 'update-data',
                data: {
                    menus: {
                        messages: {
                            type: 'category',
                            order: 0,
                            items: {
                                greetings: {
                                    type: 'category',
                                    order: 0,
                                },
                                kudos: {
                                    type: 'category',
                                    order: 1,
                                },
                                challenges: {
                                    type: 'category',
                                    order: 2,
                                },
                                statements: {
                                    type: 'category',
                                    order: 3,
                                },
                            }
                        },
                        images: {
                            type: 'category',
                            order: 1,
                            items: {
                                backgrounds: {
                                    type: 'category',
                                    order: 0,
                                },
                                'word bubbles': {
                                    type: 'category',
                                    order: 1,
                                },
                                'animals': {
                                    type: 'category',
                                    order: 2,
                                },
                                discover: {
                                    type: 'category',
                                    order: 3,
                                },
                                emoji: {
                                    type: 'category',
                                    order: 4,
                                },
                                fantasy: {
                                    type: 'category',
                                    order: 5,
                                },
                            },
                        },
                        sounds: {
                            type: 'category',
                            order: 2,
                        },
                        effects: {
                            type: 'category',
                            order: 3,
                        },
                    },
                }
            });
        }



        if (data.name === 'get-data') {

            gameData = {
                menus: {
                    messages: {
                        items: {
                            greetings: {
                                items: [

                                ],
                            },
                            kudos: {
                                items: [

                                ],
                            },
                            challenges: {
                                items: [

                                ],
                            },
                            statements: {
                                items: [
                                    {
                                        type: 'message',
                                        src: 'media/Libraries/Messages/message_demo_1_b.png',
                                    },
                                    {
                                        type: 'message',
                                        src: 'media/Libraries/Messages/message_demo_1_w.png',
                                    },
                                    {
                                        type: 'message',
                                        src: 'media/Libraries/Messages/message_demo_2_b.png',
                                    },
                                    {
                                        type: 'message',
                                        src: 'media/Libraries/Messages/message_demo_2_w.png',
                                    },
                                    {
                                        type: 'message',
                                        src: 'media/Libraries/Messages/message_demo_3_b.png',
                                    },
                                    {
                                        type: 'message',
                                        src: 'media/Libraries/Messages/message_demo_3_w.png',
                                    },
                                    {
                                        type: 'message',
                                        src: 'media/Libraries/Messages/message_demo_4_b.png',
                                    },
                                    {
                                        type: 'message',
                                        src: 'media/Libraries/Messages/message_demo_4_w.png',
                                    },
                                    {
                                        type: 'message',
                                        src: 'media/Libraries/Messages/message_demo_5_b.png',
                                    },
                                    {
                                        type: 'message',
                                        src: 'media/Libraries/Messages/message_demo_5_w.png',
                                    },
                                    {
                                        type: 'message',
                                        src: 'media/Libraries/Messages/message_demo_6_b.png',
                                    },
                                    {
                                        type: 'message',
                                        src: 'media/Libraries/Messages/message_demo_6_w.png',
                                    },
                                    {
                                        type: 'message',
                                        src: 'media/Libraries/Messages/message_demo_7_b.png',
                                    },
                                    {
                                        type: 'message',
                                        src: 'media/Libraries/Messages/message_demo_7_w.png',
                                    },
                                    {
                                        type: 'message',
                                        src: 'media/Libraries/Messages/message_demo_8_b.png',
                                    },
                                    {
                                        type: 'message',
                                        src: 'media/Libraries/Messages/message_demo_8_w.png',
                                    },
                                    {
                                        type: 'message',
                                        src: 'media/Libraries/Messages/message_demo_9_b.png',
                                    },
                                    {
                                        type: 'message',
                                        src: 'media/Libraries/Messages/message_demo_9_w.png',
                                    },
                                    {
                                        type: 'message',
                                        src: 'media/Libraries/Messages/message_demo_10_b.png',
                                    },
                                    {
                                        type: 'message',
                                        src: 'media/Libraries/Messages/message_demo_10_w.png',
                                    },
                                ],
                            },
                        }
                    },
                    images: {
                        items: {
                            backgrounds: {
                                items: [
                                    {
                                        name: 'Fun',
                                        type: 'category',
                                        src: 'media/Libraries/Images/Backgrounds/Fun/bkg_fun_1.png',
                                        items: [
                                            {
                                                type: 'background',
                                                src: 'media/Libraries/Images/Backgrounds/Fun/bkg_fun_1.png',
                                            },
                                            {
                                                type: 'background',
                                                src: 'media/Libraries/Images/Backgrounds/Fun/bkg_fun_2.png',
                                            },
                                            {
                                                type: 'background',
                                                src: 'media/Libraries/Images/Backgrounds/Fun/bkg_fun_3.png',
                                            },
                                            {
                                                type: 'background',
                                                src: 'media/Libraries/Images/Backgrounds/Fun/bkg_fun_4.png',
                                            },
                                            {
                                                type: 'background',
                                                src: 'media/Libraries/Images/Backgrounds/Fun/bkg_fun_5.png',
                                            },
                                            {
                                                type: 'background',
                                                src: 'media/Libraries/Images/Backgrounds/Fun/bkg_fun_6.png',
                                            },
                                            {
                                                type: 'background',
                                                src: 'media/Libraries/Images/Backgrounds/Fun/bkg_fun_7.png',
                                            },
                                            {
                                                type: 'background',
                                                src: 'media/Libraries/Images/Backgrounds/Fun/bkg_fun_8.png',
                                            },
                                            {
                                                type: 'background',
                                                src: 'media/Libraries/Images/Backgrounds/Fun/bkg_fun_9.png',
                                            },
                                            {
                                                type: 'background',
                                                src: 'media/Libraries/Images/Backgrounds/Fun/bkg_fun_10.png',
                                            },
                                        ],
                                    }
                                ]
                            },
                            'word bubbles': {
                                items: [

                                ],
                            },
                            'animals': {
                                items: [
                                    {
                                        name: 'Cats & Dogs',
                                        type: 'category',
                                        src: 'media/Libraries/Images/Animals/Dogs_and_Cats/img_dogs_5-01.png',
                                        items: [
                                            {
                                                type: 'item',
                                                canOverlap: false,
                                                src: 'media/Libraries/Images/Animals/Dogs_and_Cats/img_dogs_1-01.png',
                                            },
                                            {
                                                type: 'item',
                                                canOverlap: false,
                                                src: 'media/Libraries/Images/Animals/Dogs_and_Cats/img_dogs_2-01.png',
                                            },
                                            {
                                                type: 'item',
                                                canOverlap: false,
                                                src: 'media/Libraries/Images/Animals/Dogs_and_Cats/img_dogs_3-01.png',
                                            },
                                            {
                                                type: 'item',
                                                canOverlap: false,
                                                src: 'media/Libraries/Images/Animals/Dogs_and_Cats/img_dogs_4-01.png',
                                            },
                                            {
                                                type: 'item',
                                                canOverlap: false,
                                                src: 'media/Libraries/Images/Animals/Dogs_and_Cats/img_dogs_5-01.png',
                                            },
                                            {
                                                type: 'item',
                                                canOverlap: false,
                                                src: 'media/Libraries/Images/Animals/Dogs_and_Cats/img_dogs_6-01.png',
                                            },
                                            {
                                                type: 'item',
                                                canOverlap: false,
                                                src: 'media/Libraries/Images/Animals/Dogs_and_Cats/img_dogs_7-01.png',
                                            },
                                            {
                                                type: 'item',
                                                canOverlap: false,
                                                src: 'media/Libraries/Images/Animals/Dogs_and_Cats/img_dogs_8-01.png',
                                            },
                                            {
                                                type: 'item',
                                                canOverlap: false,
                                                src: 'media/Libraries/Images/Animals/Dogs_and_Cats/img_dogs_9-01.png',
                                            },
                                            {
                                                type: 'item',
                                                canOverlap: false,
                                                src: 'media/Libraries/Images/Animals/Dogs_and_Cats/img_dogs_10-01.png',
                                            },
                                        ],
                                    }
                                ]
                            },
                            discover: {
                                items: [

                                ],
                            },
                            emoji: {
                                items: [

                                ],
                            },
                            fantasy: {
                                items: [
                                    {
                                        type: 'item',
                                        canOverlap: true,
                                        src: 'http://emmastrend.com/wp-content/uploads/2015/10/Halloween-Hat-01.png',
                                    },
                                    {
                                        type: 'item',
                                        canOverlap: true,
                                        src: 'http://clipartix.com/wp-content/uploads/2016/05/Top-hat-hat-clip-art-free-clip-art-microsoft-clip-art-christmas.png',
                                    },
                                ],
                            },
                        },
                    },
                    sounds: {
                        items: [

                        ],
                    },
                    effects: {
                        items: [

                        ],
                    },
                },
                inbox: [
                    {
                        id: 1,
                        unread: true,
                        'username': 'epic_otter',
                        'profile-image': 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSCsqLsKdWtygP36IwaIq73QCJELIeF9Hquco8u4pHGXpfcs3rLWg',
                        timestamp: 1465413082450,
                    },
                    {
                        id: 2,
                        unread: false,
                        'username': 'magical_bison',
                        'profile-image': 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSCsqLsKdWtygP36IwaIq73QCJELIeF9Hquco8u4pHGXpfcs3rLWg',
                        timestamp: 1465413082450,
                    }
                ],
                outbox: [
                    {
                        id: 3,
                        sent: true,
                        'username': 'epic_otter',
                        'profile-image': 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSCsqLsKdWtygP36IwaIq73QCJELIeF9Hquco8u4pHGXpfcs3rLWg',
                        timestamp: 1465413082450,
                    },
                    {
                        id: 4,
                        sent: true,
                        'username': 'jazzy_horse',
                        'profile-image': 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSCsqLsKdWtygP36IwaIq73QCJELIeF9Hquco8u4pHGXpfcs3rLWg',
                        timestamp: 1465413082450,
                    }
                ],
                saved: [
                    {
                        id: 5,
                        thumbnail: 'media/tempthumb.png',
                        timestamp: 1465413082450,
                        background: null,
                        items: [
                            {
                                type: 'item',
                                canOverlap: false,
                                src: 'https://pbs.twimg.com/profile_images/378800000674268962/06ce58cab26c3a0daf80cf57e5acb29b_400x400.jpeg',
                                state: {
                                    left: 0,
                                    top: 0,
                                    scale: 0.75,
                                    rotation: 0,
                                    layer: 1000,
                                    zoom: 0.9197916666666667,
                                    valid: true,
                                    corners: [
                                        {
                                            x: 350,
                                            y: 350
                                        },
                                        {
                                            x: 350,
                                            y: 50
                                        },
                                        {
                                            x: 49.99999999999997,
                                            y: 50
                                        },
                                        {
                                            x: 50,
                                            y: 350
                                        }
                                    ],
                                }
                            }
                        ],
                        messages: [],
                    },
                    {
                        id: 6,
                        thumbnail: 'media/tempthumb.png',
                        timestamp: 1465413082450,
                        background: {
                            type: 'background',
                            src: 'https://encrypted-tbn2.gstatic.com/images?q=tbn: ANd9GcSnfpzoD-_HTIGH37ncMqaYiqjOI4MrXSPSTCyAHbJdSsc6O9vP'
                        },
                        items: [
                            {
                                type: 'item',
                                canOverlap: false,
                                src: 'https://encrypted-tbn3.gstatic.com/images?q=tbn: ANd9GcS2UKPvB7oXYtaSlu8_Z1NI5buUqXEBiC6V4wgc8E37CR0QXyLK',
                                state: {
                                    left: 30.44167610419026,
                                    top: 110.89467723669308,
                                    scale: 1,
                                    rotation: 0,
                                    layer: 1000,
                                    zoom: 0.9197916666666667,
                                    valid: true,
                                    corners: [
                                        {
                                            x: 255.44167610419026,
                                            y: 335.8946772366931
                                        },
                                        {
                                            x: 255.44167610419026,
                                            y: 110.8946772366931
                                        },
                                        {
                                            x: 30.441676104190236,
                                            y: 110.8946772366931
                                        },
                                        {
                                            x: 30.441676104190265,
                                            y: 335.8946772366931
                                        }
                                    ]
                                }
                            },
                            {
                                type: 'item',
                                canOverlap: true,
                                src: 'http://emmastrend.com/wp-content/uploads/2015/10/Halloween-Hat-01.png',
                                state: {
                                    left: -13.04643261608154,
                                    top: -33.703284258210644,
                                    scale: 0.47167491829736163,
                                    rotation: 0,
                                    layer: 1000,
                                    zoom: 0.9197916666666667,
                                    valid: true,
                                    corners: [
                                        {
                                            x: 175.32795692598074,
                                            y: 154.67110528385166
                                        },
                                        {
                                            x: 175.32795692598074,
                                            y: 33.92232619972707
                                        },
                                        {
                                            x: 54.57917784185614,
                                            y: 33.92232619972707
                                        },
                                        {
                                            x: 54.579177841856165,
                                            y: 154.67110528385166
                                        }
                                    ]
                                }
                            }
                        ],
                        messages: [
                            {
                                type: 'message',
                                src: 'http://www.clipartpanda.com/clipart_images/image-50104740/download',
                                state: {
                                    left: 170.69082672706682,
                                    top: 0,
                                    scale: 0.5263992949255085,
                                    rotation: 0.38889427107962315,
                                    layer: 10000,
                                    zoom: 0.9197916666666667,
                                    valid: true,
                                    corners: [
                                        {
                                            x: 507.0362854563216,
                                            y: 313.857024284831
                                        },
                                        {
                                            x: 577.8916029176775,
                                            y: 140.9391974917265
                                        },
                                        {
                                            x: 334.345367997812,
                                            y: 41.142975715169
                                        },
                                        {
                                            x: 263.4900505364561,
                                            y: 214.06080250827353
                                        }
                                    ]
                                }
                            }
                        ],
                    },
                    {
                        id: 7,
                        thumbnail: 'media/tempthumb.png',
                        timestamp: 1465413082450,
                        background: {
                            type: 'background',
                            src: 'media/Libraries/Images/Backgrounds/Fun/bkg_fun_6.png'
                        },
                        items: [
                            {
                                type: 'item',
                                canOverlap: false,
                                src: 'media/Libraries/Images/Animals/Dogs_and_Cats/img_dogs_8-01.png',
                                state: {
                                    left: -22.831257078142695,
                                    top: -90.23782559456399,
                                    scale: 0.2558923622667492,
                                    rotation: 0,
                                    layer: 1000,
                                    zoom: 0.9197916666666667,
                                    valid: true,
                                    corners: [
                                        {
                                            x: 542.3203059418945,
                                            y: 474.91373742547313
                                        },
                                        {
                                            x: 542.3203059418945,
                                            y: 244.61061138539884
                                        },
                                        {
                                            x: 312.0171799018201,
                                            y: 244.61061138539884
                                        },
                                        {
                                            x: 312.01717990182016,
                                            y: 474.91373742547313
                                        }
                                    ]
                                }
                            },
                            {
                                type: 'item',
                                canOverlap: false,
                                src: 'media/Libraries/Images/Animals/Dogs_and_Cats/img_dogs_6-01.png',
                                state: {
                                    left: -291.37032842582107,
                                    top: -305.5039637599094,
                                    scale: 0.22242840967085503,
                                    rotation: 0.16934505960887114,
                                    layer: 1000,
                                    zoom: 0.9197916666666667,
                                    valid: true,
                                    corners: [
                                        {
                                            x: 240.42134573213147,
                                            y: 260.0263482671302
                                        },
                                        {
                                            x: 274.1599836012185,
                                            y: 62.70436208213806
                                        },
                                        {
                                            x: 76.83799741622643,
                                            y: 28.965724213050933
                                        },
                                        {
                                            x: 43.099359547139315,
                                            y: 226.28771039804315
                                        }
                                    ]
                                }
                            },
                            {
                                type: 'item',
                                canOverlap: false,
                                src: 'media/Libraries/Images/Animals/Dogs_and_Cats/img_dogs_10-01.png',
                                state: {
                                    left: 235.92298980747452,
                                    top: -302.24235560588903,
                                    scale: 0.2276206871044969,
                                    rotation: -0.25258003702283816,
                                    layer: 1000,
                                    zoom: 0.9197916666666667,
                                    valid: true,
                                    corners: [
                                        {
                                            x: 810.6996956616041,
                                            y: 221.33957452203686
                                        },
                                        {
                                            x: 759.5049199354005,
                                            y: 22.980938539981466
                                        },
                                        {
                                            x: 561.146283953345,
                                            y: 74.17571426618508
                                        },
                                        {
                                            x: 612.3410596795486,
                                            y: 272.53435024824046
                                        }
                                    ]
                                }
                            }
                        ],
                        messages: [
                            {
                                type: 'message',
                                src: 'media/Libraries/Messages/message_demo_9_w.png',
                                state: {
                                    left: 163.08040770101925,
                                    top: 182.65005662514156,
                                    scale: 0.75,
                                    rotation: 0.00668180029395693,
                                    layer: 10000,
                                    zoom: 0.9197916666666667,
                                    valid: true,
                                    corners: [
                                        {
                                            x: 652.0328492286683,
                                            y: 242.67515772026974
                                        },
                                        {
                                            x: 652.368607195026,
                                            y: 192.42627945828238
                                        },
                                        {
                                            x: 233.1279661733702,
                                            y: 189.62495553001347
                                        },
                                        {
                                            x: 232.79220820701238,
                                            y: 239.87383379200077
                                        }
                                    ]
                                }
                            },
                            {
                                type: 'message',
                                src: 'media/Libraries/Messages/message_demo_3_w.png',
                                state: {
                                    left: -16.308040770101925,
                                    top: 331.59682899207246,
                                    scale: 0.75,
                                    rotation: -0.2645739567587089,
                                    layer: 10000,
                                    zoom: 0.9197916666666667,
                                    valid: true,
                                    corners: [
                                        {
                                            x: 366.9349034866344,
                                            y: 346.49458268626694
                                        },
                                        {
                                            x: 353.794625305581,
                                            y: 297.9930817886191
                                        },
                                        {
                                            x: 37.449014973161724,
                                            y: 383.699075297878
                                        },
                                        {
                                            x: 50.58929315421517,
                                            y: 432.20057619552585
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                ],
                friends: [
                    {
                        'user_id': 1,
                        name: 'epic_otter',
                        'flips_earned': 15,
                        'profile_image': 'media/Libraries/Images/Animals/Dogs_and_Cats/img_dogs_10-01.png'
                    },
                    {
                        'user_id': 2,
                        name: 'genuine_mongoose',
                        'flips_earned': 10,
                        'profile_image': 'media/Libraries/Images/Animals/Dogs_and_Cats/img_dogs_10-01.png'
                    },
                    {
                        'user_id': 3,
                        name: 'playful_beetle',
                        'flips_earned': 12,
                        'profile_image': 'media/Libraries/Images/Animals/Dogs_and_Cats/img_dogs_10-01.png'
                    },
                    {
                        'user_id': 4,
                        name: 'hip_crocodile',
                        'flips_earned': 2,
                        'profile_image': 'media/Libraries/Images/Animals/Dogs_and_Cats/img_dogs_10-01.png'
                    }
                ]
            };

            if (~data.categories.indexOf('messages') && ~data.categories.indexOf('statements')) {
                deliveryData = {
                    menus: {
                        messages: {
                            items: {
                                statements: {
                                    items: gameData.menus.messages.items.statements.items,
                                }
                            }
                        }
                    }
                };
            }

            if (~data.categories.indexOf('images') && ~data.categories.indexOf('backgrounds')) {
                deliveryData = {
                    menus: {
                        images: {
                            items: {
                                backgrounds: {
                                    items: gameData.menus.images.items.backgrounds.items,
                                }
                            }
                        }
                    }
                };
            }

            if (~data.categories.indexOf('images') && ~data.categories.indexOf('animals')) {
                deliveryData = {
                    menus: {
                        images: {
                            items: {
                                animals: {
                                    items: gameData.menus.images.items.animals.items,
                                }
                            }
                        }
                    }
                };
            }

            if (~data.categories.indexOf('images') && ~data.categories.indexOf('fantasy')) {
                deliveryData = {
                    menus: {
                        images: {
                            items: {
                                fantasy: {
                                    items: gameData.menus.images.items.fantasy.items,
                                }
                            }
                        }
                    }
                };
            }

            if (~data.categories.indexOf('inbox')) {
                deliveryData = {
                    inbox: gameData.inbox,
                    outbox: gameData.outbox,
                    saved: gameData.saved,
                };
            }

            if (~data.categories.indexOf('friends')) {
                deliveryData = {
                    friends: gameData.friends,
                };
            }

            e.respond({
                name: 'update-data',
                data: deliveryData
            });
        }



        if (data.name === 'save-skribble') {
        // console.log(data.skribble); // eslint-disable-line no-console
            console.log(JSON.stringify(data.skribble)); // eslint-disable-line no-console
        }

      // this is how to call demo mode from the platform
      // e.respond({
      //   name: 'toggle-demo-mode',
      // });
    }
    /* eslint-enable */

}
