/* Memory Palace — palaces, word lists, and levels.

   Each palace is a fixed walking route of ten spots. Floor plans are our own
   rough sketches in a 400 × 300 box: `shapes` draw the rooms, each spot has a
   marker position (x, y), and `via` bends the dashed route through doorways. */
window.MEMORY_PALACE = (function () {
  'use strict';

  // Layouts follow the real sets. The two Friends front doors face each other
  // across the hall: Monica's opens onto her kitchen with the bedrooms at the far
  // end, Joey and Chandler's has the kitchen and foosball table by the door.
  // Jerry's (Seinfeld) has the bedroom and bath along the top, the entry and
  // kitchen on the right, and the big window along the bottom.
  var PALACES = {
    monica: {
      id: 'monica',
      name: 'Monica’s apartment',
      short: 'Monica’s',
      show: 'Friends',
      shapes: [
        { t: 'path', c: 'wall', d: 'M20 226 V90 H106 M134 90 H156 M254 90 H390 V285 H20 V262' },
        { t: 'path', c: 'thin', d: 'M156 87 H254 M156 93 H254' },
        { t: 'path', c: 'thin', d: 'M20 262 H56 M56 262 A36 36 0 0 0 20 226' },
        { t: 'path', c: 'rail', d: 'M156 90 V14 H254 V90' },
        // bathroom, and the hallway up to the closet
        { t: 'path', c: 'wall-in', d: 'M36 90 V26 H104 V56 M104 84 V90' },
        { t: 'path', c: 'wall-in', d: 'M104 26 V6 H136 V90 M104 34 H112 M128 34 H136' },
        { t: 'rect', c: 'furn', x: 42, y: 32, w: 32, h: 16, rx: 7 },
        { t: 'circle', c: 'thin', cx: 92, cy: 40, r: 5 },
        { t: 'rect', c: 'furn soft', x: 110, y: 12, w: 8, h: 7, rot: -15 },
        { t: 'rect', c: 'furn soft', x: 121, y: 20, w: 9, h: 7, rot: 20 },
        // bedrooms
        { t: 'path', c: 'wall-in', d: 'M300 90 V108 M300 130 V204 M300 226 V285 M300 188 H390' },
        { t: 'rect', c: 'furn soft', x: 326, y: 104, w: 46, h: 32, rx: 2 },
        { t: 'rect', c: 'furn soft', x: 326, y: 208, w: 46, h: 32, rx: 2 },
        // kitchen along the left wall
        { t: 'rect', c: 'furn soft', x: 22, y: 116, w: 20, h: 96 },
        { t: 'rect', c: 'furn soft', x: 46, y: 92, w: 50, h: 14 },
        { t: 'rect', c: 'furn', x: 22, y: 92, w: 24, h: 22 },
        { t: 'rect', c: 'furn', x: 23, y: 150, w: 18, h: 22 },
        { t: 'circle', c: 'thin', cx: 28, cy: 156, r: 2.4 },
        { t: 'circle', c: 'thin', cx: 36, cy: 156, r: 2.4 },
        { t: 'circle', c: 'thin', cx: 28, cy: 166, r: 2.4 },
        { t: 'circle', c: 'thin', cx: 36, cy: 166, r: 2.4 },
        // round table with mismatched chairs
        { t: 'rect', c: 'furn soft', x: 94, y: 152, w: 12, h: 8 },
        { t: 'rect', c: 'furn soft', x: 93, y: 196, w: 15, h: 9 },
        { t: 'rect', c: 'furn soft', x: 74, y: 172, w: 8, h: 12 },
        { t: 'rect', c: 'furn soft', x: 118, y: 171, w: 10, h: 15 },
        { t: 'circle', c: 'furn', cx: 100, cy: 178, r: 17 },
        // living room
        { t: 'rect', c: 'furn soft', x: 158, y: 94, w: 94, h: 10, rx: 3 },
        { t: 'rect', c: 'furn', x: 196, y: 112, w: 24, h: 22, rx: 5 },
        { t: 'rect', c: 'furn', x: 160, y: 150, w: 20, h: 70, rx: 5 },
        { t: 'path', c: 'thin', d: 'M165 155 V215' },
        { t: 'rect', c: 'furn', x: 196, y: 172, w: 24, h: 24, rx: 2 },
        { t: 'rect', c: 'furn', x: 286, y: 150, w: 12, h: 44 },
        { t: 'rect', c: 'furn soft', x: 238, y: 236, w: 18, h: 18, rx: 5 },
        { t: 'rect', c: 'furn soft', x: 262, y: 250, w: 18, h: 18, rx: 5 },
        { t: 'text', x: 66, y: 216, s: 'kitchen', a: 'start' },
        { t: 'text', x: 200, y: 278, s: 'living room' },
        { t: 'text', x: 205, y: 70, s: 'balcony' },
        { t: 'text', x: 50, y: 84, s: 'bath' },
        { t: 'text', x: 345, y: 160, s: 'Monica’s' },
        { t: 'text', x: 345, y: 266, s: 'Rachel’s' }
      ],
      spots: [
        { id: 'door', name: 'The purple door', note: 'The way in from the hall. A little yellow frame hangs around the peephole.', x: 42, y: 244 },
        { id: 'stove', name: 'The stove', note: 'On the kitchen wall to your left. There’s always a pot going.', x: 58, y: 161 },
        { id: 'fridge', name: 'The fridge', note: 'In the corner where the kitchen counters meet.', x: 60, y: 118 },
        { id: 'table', name: 'The dining table', note: 'Round, with chairs that don’t match.', x: 100, y: 178 },
        { id: 'couch', name: 'The couch', note: 'In the middle of the room. Where everyone ends up.', x: 170, y: 185 },
        { id: 'coffee', name: 'The coffee table', note: 'Right in front of the couch.', x: 208, y: 184 },
        { id: 'armchair', name: 'The armchair', note: 'By the big window, facing the room.', x: 208, y: 123 },
        { id: 'balcony', name: 'The balcony', note: 'Out through the big window.', x: 205, y: 40 },
        { id: 'closet', name: 'The locked closet', note: 'At the end of the little hallway. Monica keeps it shut. Inside, total chaos.', x: 120, y: 20, via: [[205, 100], [120, 100], [120, 50]] },
        { id: 'bath', name: 'The bathtub', note: 'In the bathroom off the little hallway.', x: 70, y: 64, via: [[120, 50], [118, 70]] }
      ]
    },

    joey: {
      id: 'joey',
      name: 'Joey and Chandler’s apartment',
      short: 'Joey and Chandler’s',
      show: 'Friends',
      shapes: [
        { t: 'path', c: 'wall', d: 'M340 236 V90 H290 M262 90 H14 V285 H340 V272' },
        { t: 'path', c: 'thin', d: 'M340 272 H304 M304 272 A36 36 0 0 1 340 236' },
        { t: 'path', c: 'thin', d: 'M140 87 H230 M140 93 H230' },
        { t: 'rect', c: 'rail', x: 348, y: 30, w: 44, h: 250 },
        // bathroom
        { t: 'path', c: 'wall-in', d: 'M250 90 V20 H330 V90' },
        { t: 'rect', c: 'furn', x: 258, y: 26, w: 34, h: 16, rx: 7 },
        { t: 'circle', c: 'thin', cx: 318, cy: 32, r: 5 },
        // bedrooms
        { t: 'path', c: 'wall-in', d: 'M110 90 V124 M110 146 V220 M110 242 V285 M14 188 H110' },
        { t: 'rect', c: 'furn soft', x: 28, y: 106, w: 46, h: 34, rx: 2 },
        { t: 'rect', c: 'furn soft', x: 28, y: 206, w: 46, h: 34, rx: 2 },
        // kitchen counter with stools and pizza boxes
        { t: 'rect', c: 'furn soft', x: 300, y: 120, w: 38, h: 70 },
        { t: 'circle', c: 'thin', cx: 291, cy: 132, r: 5 },
        { t: 'circle', c: 'thin', cx: 291, cy: 176, r: 5 },
        { t: 'rect', c: 'furn', x: 308, y: 166, w: 16, h: 12 },
        { t: 'rect', c: 'furn', x: 311, y: 163, w: 16, h: 12, rot: 8 },
        // foosball by the door
        { t: 'path', c: 'thin', d: 'M252 238 H282 M252 247 H282 M252 256 H282 M252 265 H282' },
        { t: 'rect', c: 'furn', x: 256, y: 230, w: 22, h: 42, rx: 2 },
        { t: 'path', c: 'thin', d: 'M256 238 H278 M256 247 H278 M256 256 H278 M256 265 H278' },
        // couch under the window, with the dog at its end
        { t: 'rect', c: 'furn', x: 140, y: 95, w: 90, h: 20, rx: 5 },
        { t: 'path', c: 'thin', d: 'M145 100 H225' },
        { t: 'ellipse', c: 'furn', cx: 246, cy: 112, rx: 7, ry: 10 },
        { t: 'circle', c: 'furn', cx: 246, cy: 99, r: 5.5 },
        // recliners facing the TV
        { t: 'rect', c: 'furn', x: 168, y: 160, w: 28, h: 34, rx: 5, rot: -12 },
        { t: 'rect', c: 'furn', x: 206, y: 168, w: 28, h: 34, rx: 5, rot: 10 },
        { t: 'rect', c: 'furn', x: 112, y: 156, w: 12, h: 46 },
        // canoe and the birds along the bottom wall
        { t: 'ellipse', c: 'furn', cx: 170, cy: 268, rx: 42, ry: 9 },
        { t: 'ellipse', c: 'thin', cx: 170, cy: 268, rx: 33, ry: 4.5 },
        { t: 'rect', c: 'furn soft', x: 218, y: 256, w: 24, h: 20, rx: 3 },
        { t: 'circle', c: 'thin', cx: 225, cy: 266, r: 3 },
        { t: 'ellipse', c: 'thin', cx: 235, cy: 266, rx: 4, ry: 3 },
        { t: 'text', x: 319, y: 110, s: 'kitchen' },
        { t: 'text', x: 180, y: 140, s: 'living room' },
        { t: 'text', x: 290, y: 60, s: 'bath' },
        { t: 'text', x: 370, y: 48, s: 'hall' },
        { t: 'text', x: 62, y: 176, s: 'Joey’s room' },
        { t: 'text', x: 62, y: 276, s: 'Chandler’s' }
      ],
      spots: [
        { id: 'door', name: 'The drawing-board door', note: 'Across the hall from Monica’s, with a drawing board stuck to it.', x: 318, y: 254 },
        { id: 'foosball', name: 'The foosball table', note: 'Just inside the door, mid-game as always.', x: 267, y: 250 },
        { id: 'counter', name: 'The kitchen counter', note: 'Stools in front, pizza boxes stacked on top.', x: 319, y: 140 },
        { id: 'dog', name: 'The white ceramic dog', note: 'Life-size, sitting at the end of the couch.', x: 246, y: 134 },
        { id: 'recliners', name: 'The two recliners', note: 'In the middle of the room, both tipped back.', x: 202, y: 182 },
        { id: 'tv', name: 'The big TV', note: 'Against the wall, facing the recliners.', x: 140, y: 179 },
        { id: 'joey-door', name: 'Joey’s bedroom door', note: 'Just past the TV.', x: 122, y: 135 },
        { id: 'canoe', name: 'The canoe', note: 'Somehow, a canoe lives along the far wall.', x: 170, y: 248 },
        { id: 'birds', name: 'The bird corner', note: 'Home to a chick and a duck.', x: 230, y: 240 },
        { id: 'hall', name: 'The hallway', note: 'Back out the door, between the two apartments.', x: 370, y: 160, via: [[248, 214], [300, 214], [324, 254], [354, 254]] }
      ]
    },

    jerry: {
      id: 'jerry',
      name: 'Jerry’s apartment',
      short: 'Jerry’s',
      show: 'Seinfeld',
      shapes: [
        { t: 'path', c: 'wall', d: 'M320 70 V60 H250 V14 H20 V285 H390 V150 H320 V104' },
        { t: 'path', c: 'thin', d: 'M320 104 H286 M286 104 A34 34 0 0 1 320 70' },
        { t: 'rect', c: 'rail', x: 328, y: 40, w: 64, h: 96 },
        { t: 'path', c: 'wall-in', d: 'M130 14 V110 M20 110 H88 M112 110 H200 M224 110 H250 V60' },
        { t: 'path', c: 'thin', d: 'M130 282 H230 M130 288 H230' },
        // bedroom and bathroom
        { t: 'rect', c: 'furn soft', x: 36, y: 28, w: 50, h: 44, rx: 2 },
        { t: 'rect', c: 'furn', x: 40, y: 31, w: 18, h: 9, rx: 3 },
        { t: 'rect', c: 'furn', x: 64, y: 31, w: 18, h: 9, rx: 3 },
        { t: 'rect', c: 'furn', x: 140, y: 20, w: 44, h: 16, rx: 7 },
        { t: 'circle', c: 'thin', cx: 236, cy: 28, r: 5 },
        // the bike, hung by the door
        { t: 'circle', c: 'thin', cx: 258, cy: 70, r: 6 },
        { t: 'circle', c: 'thin', cx: 278, cy: 70, r: 6 },
        { t: 'path', c: 'thin', d: 'M258 70 L268 63 L278 70' },
        // kitchen: cereal shelf, counter along the wall, and the peninsula with stools
        { t: 'rect', c: 'furn soft', x: 326, y: 152, w: 44, h: 10 },
        { t: 'rect', c: 'furn', x: 330, y: 153, w: 6, h: 8 },
        { t: 'rect', c: 'furn', x: 339, y: 153, w: 6, h: 8 },
        { t: 'rect', c: 'furn', x: 348, y: 153, w: 6, h: 8 },
        { t: 'rect', c: 'furn', x: 357, y: 153, w: 6, h: 8 },
        { t: 'rect', c: 'furn soft', x: 372, y: 162, w: 16, h: 118 },
        { t: 'circle', c: 'thin', cx: 380, cy: 190, r: 2.6 },
        { t: 'circle', c: 'thin', cx: 380, cy: 200, r: 2.6 },
        { t: 'rect', c: 'furn soft', x: 300, y: 186, w: 16, h: 76 },
        { t: 'circle', c: 'thin', cx: 290, cy: 200, r: 4.5 },
        { t: 'circle', c: 'thin', cx: 290, cy: 224, r: 4.5 },
        { t: 'circle', c: 'thin', cx: 290, cy: 248, r: 4.5 },
        // round table with chairs
        { t: 'rect', c: 'furn soft', x: 184, y: 128, w: 12, h: 8 },
        { t: 'rect', c: 'furn soft', x: 184, y: 164, w: 12, h: 8 },
        { t: 'rect', c: 'furn soft', x: 166, y: 144, w: 8, h: 12 },
        { t: 'rect', c: 'furn soft', x: 206, y: 144, w: 8, h: 12 },
        { t: 'circle', c: 'furn', cx: 190, cy: 150, r: 15 },
        // living room
        { t: 'rect', c: 'furn', x: 150, y: 190, w: 70, h: 22, rx: 5 },
        { t: 'path', c: 'thin', d: 'M155 195 H215' },
        { t: 'rect', c: 'furn', x: 162, y: 226, w: 44, h: 16, rx: 2 },
        { t: 'rect', c: 'furn', x: 236, y: 214, w: 26, h: 26, rx: 5 },
        { t: 'circle', c: 'furn soft', cx: 244, cy: 272, r: 7 },
        { t: 'rect', c: 'furn', x: 22, y: 150, w: 16, h: 50 },
        { t: 'circle', c: 'thin', cx: 50, cy: 175, r: 5 },
        { t: 'text', x: 60, y: 98, s: 'bedroom' },
        { t: 'text', x: 160, y: 96, s: 'bath' },
        { t: 'text', x: 360, y: 54, s: 'hall' },
        { t: 'text', x: 340, y: 276, s: 'kitchen' },
        { t: 'text', x: 76, y: 270, s: 'living room' }
      ],
      spots: [
        { id: 'door', name: 'The front door', note: 'Where Kramer slides in without knocking.', x: 300, y: 90 },
        { id: 'bike', name: 'The bike on the wall', note: 'Hanging just inside the door.', x: 268, y: 92 },
        { id: 'counter', name: 'The kitchen counter', note: 'Stools lined up along it.', x: 308, y: 224 },
        { id: 'cereal', name: 'The cereal shelf', note: 'A whole row of cereal boxes over the kitchen.', x: 348, y: 176 },
        { id: 'table', name: 'The dining table', note: 'Small and round, in the middle of the room.', x: 190, y: 150 },
        { id: 'couch', name: 'The couch', note: 'Facing the big window.', x: 185, y: 201 },
        { id: 'window', name: 'The big window', note: 'Across the whole wall, with a plant beside it.', x: 180, y: 268 },
        { id: 'desk', name: 'The desk', note: 'Against the far wall, with the computer on it.', x: 48, y: 175 },
        { id: 'bed', name: 'The bed', note: 'In the bedroom off the living room.', x: 61, y: 50, via: [[100, 124], [100, 98]] },
        { id: 'bath', name: 'The bathtub', note: 'In the bathroom next to the bedroom.', x: 196, y: 56, via: [[100, 98], [100, 124], [212, 124], [212, 98]] }
      ]
    }
  };

  // Concrete, easy-to-picture things. Nothing that shares a name with a spot.
  var OBJECTS = [
    'anchor', 'anvil', 'apple', 'arrow', 'axe', 'backpack', 'bagpipes', 'balloon', 'banana', 'bandage',
    'barrel', 'basket', 'bagel', 'binoculars', 'blender', 'boomerang', 'bottle', 'bracelet', 'briefcase', 'broom',
    'bucket', 'butterfly', 'cactus', 'camel', 'camera', 'candle', 'cannon', 'carrot', 'castle', 'cauliflower',
    'cello', 'chainsaw', 'chandelier', 'cherry', 'chimney', 'clock', 'coconut', 'compass', 'corn', 'cowboy',
    'crab', 'crayon', 'crown', 'crystal', 'cucumber', 'cupcake', 'dagger', 'diamond', 'dinosaur', 'dolphin',
    'donut', 'dragon', 'drum', 'dynamite', 'eagle', 'easel', 'eggplant', 'elephant', 'envelope', 'eraser',
    'feather', 'fence', 'firework', 'flag', 'flamingo', 'flashlight', 'flute', 'fork', 'fountain', 'frog',
    'garlic', 'ghost', 'giraffe', 'glove', 'goat', 'goggles', 'gorilla', 'grapes', 'guitar', 'hammer',
    'hammock', 'harmonica', 'harp', 'helicopter', 'helmet', 'hippo', 'honey', 'horseshoe', 'hose', 'hourglass',
    'iceberg', 'igloo', 'jellyfish', 'kangaroo', 'kettle', 'key', 'kite', 'knight', 'koala', 'ladder',
    'lamp', 'lantern', 'lemon', 'lighthouse', 'lipstick', 'lizard', 'llama', 'lobster', 'lollipop', 'magnet',
    'mailbox', 'mango', 'mermaid', 'meteor', 'microphone', 'microscope', 'mirror', 'mitten', 'monkey', 'mop',
    'motorcycle', 'mushroom', 'necklace', 'needle', 'octopus', 'onion', 'orange', 'ostrich', 'owl', 'paintbrush',
    'pancake', 'panda', 'parachute', 'parrot', 'peacock', 'peanut', 'pear', 'pearl', 'penguin', 'pepper',
    'piano', 'pickle', 'pig', 'pillow', 'pineapple', 'pirate', 'pitchfork', 'popcorn', 'porcupine', 'potato',
    'pretzel', 'pumpkin', 'puppet', 'rabbit', 'raccoon', 'radio', 'rainbow', 'rake', 'robot', 'rocket',
    'sandwich', 'satellite', 'saxophone', 'scarecrow', 'scissors', 'scorpion', 'seahorse', 'shark', 'skateboard', 'skeleton',
    'skunk', 'sled', 'slingshot', 'snail', 'snake', 'snowman', 'spaghetti', 'spider', 'sponge', 'spoon',
    'squid', 'squirrel', 'stapler', 'starfish', 'statue', 'stethoscope', 'strawberry', 'submarine', 'suitcase', 'sunflower',
    'surfboard', 'sword', 'taco', 'telescope', 'tent', 'tiger', 'toaster', 'tomato', 'toothbrush', 'tornado',
    'tractor', 'trampoline', 'trombone', 'trophy', 'trumpet', 'turkey', 'turtle', 'umbrella', 'unicorn', 'vacuum',
    'vampire', 'violin', 'volcano', 'waffle', 'walrus', 'watermelon', 'whale', 'wheelbarrow', 'whistle', 'wizard',
    'wolf', 'xylophone', 'yo-yo', 'zebra', 'zipper'
  ];

  // The Major system: each digit is a consonant sound, vowels are free filler.
  var DIGIT_SOUNDS = ['s, z', 't, d', 'n', 'm', 'r', 'l', 'j, sh, ch', 'k, g', 'f, v', 'p, b'];

  // One picture for every pair from 00 to 99.
  var PEGS = [
    'seesaw', 'suit', 'sun', 'sumo', 'sari', 'sail', 'sash', 'sock', 'safe', 'soap',
    'toes', 'teddy', 'tuna', 'dome', 'tire', 'towel', 'dish', 'deck', 'dove', 'tuba',
    'nose', 'net', 'nun', 'gnome', 'Nero', 'nail', 'nacho', 'neck', 'knife', 'knob',
    'moose', 'mat', 'moon', 'mummy', 'mower', 'mule', 'match', 'mug', 'movie', 'map',
    'rose', 'rat', 'rain', 'ram', 'rower', 'roll', 'roach', 'rock', 'roof', 'rope',
    'lasso', 'light', 'lion', 'lamb', 'lyre', 'lily', 'leash', 'lock', 'leaf', 'lip',
    'cheese', 'sheet', 'chain', 'jam', 'cherry', 'shell', 'judge', 'jug', 'chef', 'ship',
    'goose', 'cat', 'coin', 'comb', 'car', 'coil', 'cage', 'cake', 'cave', 'cube',
    'face', 'foot', 'fan', 'foam', 'fire', 'file', 'fish', 'fog', 'fife', 'Phoebe',
    'bus', 'bat', 'pen', 'puma', 'bear', 'bell', 'beach', 'book', 'beehive', 'pipe'
  ];

  var LEVELS = [
    { n: 1, name: 'Objects', blurb: 'Ten things, one per spot.', kind: 'objects', perSpot: 1, names: true },
    { n: 2, name: 'Objects, by memory', blurb: 'Ten things. When you recall them, the spot names are hidden.', kind: 'objects', perSpot: 1, names: false },
    { n: 3, name: 'Two objects per spot', blurb: 'Twenty things, two at each spot.', kind: 'objects', perSpot: 2, names: false },
    { n: 4, name: 'Numbers, with hints', blurb: 'Ten two-digit numbers, turned into pictures with the Major system. Hints on.', kind: 'numbers', perSpot: 1, names: false, hints: true },
    { n: 5, name: 'Numbers', blurb: 'Ten two-digit numbers. Hints only if you ask.', kind: 'numbers', perSpot: 1, names: false },
    { n: 6, name: 'Two numbers per spot', blurb: 'Forty digits, two numbers at each spot.', kind: 'numbers', perSpot: 2, names: false }
  ];

  return { PALACES: PALACES, ORDER: ['monica', 'joey', 'jerry'], OBJECTS: OBJECTS, DIGIT_SOUNDS: DIGIT_SOUNDS, PEGS: PEGS, LEVELS: LEVELS };
})();
