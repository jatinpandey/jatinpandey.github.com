// The path energy takes through the movement, from your fingers on the crown to the
// swinging balance. Each step names the part it highlights, what that part does, and
// how it sets off the next step. Part ids match components.js.
export const phases={
 wind:'Winding: you put energy in',
 store:'Storing: the spring holds it',
 transmit:'Transmitting: gears carry it',
 regulate:'Regulating: the escapement lets it out one beat at a time'
};

export const flow=[
 {part:'crown',phase:'wind',title:'You turn the crown',
  what:'Your fingers turn the crown, which spins the stem that reaches into the movement.',
  handoff:'The spinning stem turns the keyless works.'},
 {part:'keyless',phase:'wind',title:'The clutch chooses winding',
  what:'With the crown pushed in, the sliding clutch meshes with the winding gears rather than the hand-setting gears.',
  handoff:'The clutch turns the crown wheel.'},
 {part:'winding',supporting:['click'],phase:'wind',title:'The winding wheels turn the arbor',
  what:'The crown wheel drives the ratchet wheel, which is fixed to the barrel arbor. The click lets the ratchet turn only forward, so no wind is lost.',
  handoff:'The turning arbor coils the mainspring.'},
 {part:'mainspring',phase:'store',title:'The mainspring stores the energy',
  what:'Each turn coils the spring tighter around the arbor. It now holds all the energy that will run the watch.',
  handoff:'Trying to uncoil, the spring pushes outward on the barrel wall.'},
 {part:'barrel',phase:'transmit',title:'The barrel starts to turn',
  what:'The click holds the arbor still, so the uncoiling spring turns the toothed barrel instead: slowly, but with plenty of force.',
  handoff:'The barrel’s teeth drive the centre wheel’s pinion.'},
 {part:'centre',phase:'transmit',title:'The centre wheel turns once an hour',
  what:'The first wheel in the gear train. It also drives the cannon pinion and the hands (see the branch below).',
  handoff:'Its large wheel drives the third wheel’s pinion.'},
 {part:'third',phase:'transmit',title:'The third wheel speeds things up',
  what:'A big wheel driving a small pinion multiplies the speed. The third wheel turns once every ten minutes.',
  handoff:'It drives the fourth wheel’s pinion.'},
 {part:'fourth',phase:'transmit',title:'The fourth wheel turns once a minute',
  what:'Its shaft carries the small-seconds hand on the dial side.',
  handoff:'It drives the escape wheel’s pinion.'},
 {part:'escape',phase:'regulate',title:'The escape wheel presses against a lock',
  what:'Left alone, the gear train would spin freely and the spring would empty in seconds. Instead, an escape-wheel tooth rests against a pallet stone and waits.',
  handoff:'When the lock opens, the freed tooth pushes on the pallet fork.'},
 {part:'fork',phase:'regulate',title:'The pallet fork lets one tooth through',
  what:'Unlocked by the balance, the fork lets a tooth slide along its pallet stone, which kicks the fork sideways. Its other stone then catches the next tooth.',
  handoff:'The fork passes that kick to the impulse jewel.'},
 {part:'roller',phase:'regulate',title:'The impulse jewel takes the kick',
  what:'At the middle of each swing the jewel on the balance’s roller sits in the fork’s slot, receives the push, then swings clear.',
  handoff:'The push adds a little energy to the balance wheel.'},
 {part:'balance',phase:'regulate',title:'The balance wheel swings',
  what:'Its momentum carries it through a wide arc. Friction costs it a little energy on every swing; the kicks from the escapement replace it.',
  handoff:'As it swings out, it winds up the hairspring.'},
 {part:'hairspring',phase:'regulate',title:'The hairspring pulls it back',
  what:'The spiral coils and uncoils, pulling the balance back toward the centre. Spring and balance together set the steady beat: five ticks a second in this model.',
  handoff:'On the return swing, the impulse jewel knocks the fork and unlocks the next tooth.',
  loopsBackTo:'escape'}
];

// Side path off the gear train: the same energy, a tiny share of it, turns the hands.
export const displayBranch={from:'centre',title:'Branch: turning the hands',
 steps:[
  {part:'cannon',what:'Friction-fitted to the centre wheel’s shaft, it turns once an hour and carries the minute hand.'},
  {part:'motion',what:'The minute wheel and hour wheel slow that rotation twelve times for the hour hand.'},
  {part:'hands',what:'The hour, minute and small-seconds hands turn the gear train’s motion into readable time.'}
 ]};
