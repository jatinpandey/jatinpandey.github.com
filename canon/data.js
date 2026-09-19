/* Canon — the catalogue.
   Plain script so it loads from file:// too; scripts/ read it with require().
   Images are hot-linked from Wikimedia Commons via Special:FilePath (see app.js).
   Every entry is public domain. Categories are date ranges, so they never overlap:
     old        1400–1780  Renaissance, Baroque, Dutch Golden Age
     nineteenth 1780–1886  Neoclassicism, Romanticism, Realism, Impressionism, ukiyo-e
     modern     1886–1950  Post-Impressionism to abstraction and American realism        */

/* The keys are not the labels, and must not be renamed: the daily shuffle is
   seeded on them, so changing one deals a different hand for that era from then
   on. Rename the label instead; nothing but the page reads it. */
const CATEGORIES = {
  old:        { name: 'Renaissance to Rococo',      span: '1400 – 1780', blurb: 'Renaissance, Mannerism, Baroque and Rococo — the age of the Old Masters.' },
  nineteenth: { name: 'Revolution to Impressionism', span: '1780 – 1886', blurb: 'Neoclassicism, Romanticism, Realism, ukiyo-e, and the Impressionists.' },
  modern:     { name: 'Modern',                     span: '1886 – 1950', blurb: 'From Post-Impressionism to pure abstraction.' },
};

const ARTWORKS = [
/* ───────────────────────────── OLD MASTERS ───────────────────────────── */
{
  id: 'arnolfini-portrait', category: 'old',
  title: 'The Arnolfini Portrait', artist: 'Jan van Eyck', artistDates: 'c. 1390 – 1441',
  year: '1434', sort: 1434, medium: 'Oil on oak', dims: '82 × 60 cm',
  museum: 'National Gallery', city: 'London',
  file: 'Van Eyck - Arnolfini Portrait.jpg', w: 4386, h: 6000, wiki: 'Arnolfini_Portrait',
  history: [
    'Painted in Bruges in 1434, this is one of the oldest surviving oil paintings on panel, made at the moment when oil was overtaking egg tempera as the medium of Northern Europe. On the back wall van Eyck signed it in florid Latin, “Jan van Eyck was here, 1434”, a witness’s inscription rather than an artist’s.',
    'The panel passed through Habsburg hands in Spain, vanished during the Napoleonic wars, and turned up with a Scottish officer who carried it home from the Peninsular campaign. The National Gallery bought it in 1842, when the museum was barely two decades old.',
  ],
  depicts: [
    'A prosperous couple, probably the Italian merchant Giovanni di Nicolao Arnolfini and his wife, stand in a Bruges bedchamber. Every object has been read as a symbol: the single lit candle, the dog for fidelity, the discarded clogs, the oranges on the sill. The woman is not pregnant; she is gathering the fashionable excess of her green gown.',
    'The convex mirror at the back reflects the whole room in miniature, including two figures in the doorway, one presumably the painter. Ten scenes from the Passion ring its frame, each a few millimetres wide.',
  ],
  about: [
    'Van Eyck was court painter to Philip the Good, Duke of Burgundy, who sent him on diplomatic missions and paid him well enough to sign his work with the motto “Als ich can”, as best I can. He did not invent oil painting, but he perfected its glazing so thoroughly that the sixteenth century believed he had.',
  ],
  echoes: [
    { label: 'Velázquez, Las Meninas (1656)', note: 'The mirror on the back wall that pulls the viewer into the room is a direct descendant.' },
    { label: 'David Hockney, Secret Knowledge (2001)', note: 'Hockney used the chandelier’s precision to argue van Eyck worked with optical projections. Most historians disagree.' },
    { label: 'Erwin Panofsky (1934)', note: 'His essay reading the painting as a marriage certificate launched a century of argument about what it records.' },
  ],
  summary: 'In the year 1434, in the wealthy trading city of Bruges, a painter named Jan van Eyck did something quietly astonishing. He set down, in oil, a room so complete that you can count the beads of the rosary on the wall and read the Passion of Christ in the frame of a mirror the size of a saucer. We call it the Arnolfini Portrait. A merchant and his wife stand hand in hand. A small dog looks out at us. A single candle burns in the chandelier at midday. And on the back wall, above the mirror, the painter has written, in careful Latin, “Jan van Eyck was here.” Not “painted this”. Was here. He is a witness, and if you look into that mirror you will find him, a tiny figure in the doorway, looking back. For centuries scholars have argued over what the picture records: a wedding, a betrothal, a memorial. The truth is that we do not know. What we do know is that oil paint, in this man’s hands, became a way of holding light itself. The fur, the brass, the oranges on the sill, each reflects the window in its own particular way. The panel travelled from Bruges to the Spanish court, was lost in the chaos of Napoleon’s wars, and was carried back to Britain by a soldier. It has hung in London since 1842, and it still rewards anyone willing to lean in and look.',
},
{
  id: 'birth-of-venus', category: 'old',
  title: 'The Birth of Venus', artist: 'Sandro Botticelli', artistDates: 'c. 1445 – 1510',
  year: 'c. 1484 – 1486', sort: 1485, medium: 'Tempera on canvas', dims: '172 × 278 cm',
  museum: 'Uffizi Gallery', city: 'Florence',
  file: 'Sandro Botticelli - La nascita di Venere - Google Art Project - edited.jpg', w: 30000, h: 18840, wiki: 'The_Birth_of_Venus',
  tags: ['myth'],
  history: [
    'Almost certainly painted for a member of the Medici family, the picture hung for centuries at the villa of Castello outside Florence beside Botticelli’s Primavera. It is one of the first large-scale canvases in Tuscany, and one of the first monumental nudes painted since antiquity that had no Christian excuse.',
    'It was largely forgotten until the nineteenth century, when the Pre-Raphaelites and John Ruskin rediscovered Botticelli and made him a cult. Since then it has become the emblem of the Florentine Renaissance, and the Uffizi’s most photographed wall.',
  ],
  depicts: [
    'Venus, born from the sea foam, arrives at the shore standing on a scallop shell. Zephyr, the west wind, blows her in with the nymph Chloris in his arms; on the right, one of the Horae rushes to cover her with a flowered cloak. The pose is the ancient “Venus Pudica”, modest Venus, borrowed from Roman marbles the Medici collected.',
    'Botticelli was not interested in anatomy or perspective; the neck is too long, the shoulder slopes impossibly, the sea is a pattern of little chevrons. He was after line and rhythm, and gold was applied to the hair so the picture would glow by candlelight.',
  ],
  about: [
    'Botticelli spent his whole life in Florence, trained under Fra Filippo Lippi and painted for the Medici circle of poets and philosophers. In old age he fell under the spell of the preacher Savonarola, who condemned exactly this kind of pagan beauty, and he may have burned some of his own work. He died poor and unfashionable.',
  ],
  echoes: [
    { label: 'Homeric Hymn to Aphrodite; Poliziano’s Stanze', note: 'The Medici poet Angelo Poliziano’s verses describing Venus blown to shore are the likeliest source.' },
    { label: 'Andy Warhol, Details of Renaissance Paintings (1984)', note: 'Screenprinted Venus’s face in acid colour, forty years before it became a meme.' },
    { label: 'Adobe Illustrator splash screen (1987 – 2010s)', note: 'Venus’s face in vector lines introduced the software to a generation of designers.' },
    { label: 'Uma Thurman in The Adventures of Baron Munchausen (1988)', note: 'Terry Gilliam recreated the shell arrival, and Lady Gaga did it again in the “Applause” video.' },
  ],
  summary: 'Somewhere around the year 1485, in a workshop in Florence, Sandro Botticelli painted a goddess arriving on a shell. She had not been seen like this for a thousand years. Since the fall of Rome, a naked woman on a wall of this size, with no saint and no sin to excuse her, was unthinkable. But this was Florence under the Medici, where poets read Plato and believed that beauty itself was a road to the divine. Venus rises from the foam. The west wind, tangled with a nymph, blows her towards the shore, and a figure in a flowered dress hurries to cover her. Notice what Botticelli chose not to care about. Her neck is too long. Her left shoulder slopes away impossibly. The sea is a pattern of little marks, like the scales of a fish. He was not after anatomy. He was after line, the long unbroken curve of a body and a lock of hair touched with real gold so that it would shimmer in candlelight. For three hundred years the picture hung in a country villa, more or less ignored. Then the Victorians fell in love with it, and it has never been out of fashion since. It has been on software splash screens, in pop videos, on countless fridge magnets. Botticelli himself, in old age, came under the sway of a preacher who called such beauty sinful, and died poor. His goddess, standing on her shell, has outlasted them both.',
},
{
  id: 'last-supper', category: 'old',
  title: 'The Last Supper', artist: 'Leonardo da Vinci', artistDates: '1452 – 1519',
  year: '1495 – 1498', sort: 1498, medium: 'Tempera and oil on plaster', dims: '460 × 880 cm',
  museum: 'Santa Maria delle Grazie', city: 'Milan',
  file: 'Leonardo da Vinci - The Last Supper high res.jpg', w: 5381, h: 2926, wiki: 'The_Last_Supper_(Leonardo)',
  history: [
    'Commissioned by Ludovico Sforza, Duke of Milan, for the refectory wall of a Dominican convent, so that the friars would eat their meals beneath the meal. Leonardo, who hated the speed true fresco demanded, painted instead on dry plaster with an experimental mix of tempera and oil. It began flaking within twenty years.',
    'The wall has survived a doorway cut through Christ’s feet, Napoleon’s cavalry using the room as a stable, a flood, and an Allied bomb in 1943 that destroyed the roof and left the painting standing under sandbags. A twenty-one-year restoration finished in 1999 removed centuries of overpaint. Perhaps a fifth of what you see is Leonardo’s own hand.',
  ],
  depicts: [
    'The moment Christ says, “One of you will betray me.” Leonardo abandons the calm row of earlier Last Suppers and lets the sentence detonate down the table: the apostles recoil, argue, and protest in four groups of three, while Christ sits still at the vanishing point of the room’s perspective.',
    'Judas, for the first time, is not isolated on the near side of the table. He sits among the others, in shadow, clutching his purse and knocking over the salt.',
  ],
  about: [
    'Leonardo was in his mid-forties, seventeen years into his Milanese period, and famous for leaving things unfinished. Contemporaries recorded him standing before the wall for hours without lifting a brush, then adding two strokes and leaving. The prior complained; Leonardo threatened to use the prior’s face for Judas.',
  ],
  echoes: [
    { label: 'Gospel of John 13:21', note: 'The text on which the composition turns.' },
    { label: 'Andy Warhol, The Last Supper series (1986)', note: 'A hundred silkscreens made in the last year of his life, his largest series.' },
    { label: 'Luis Buñuel, Viridiana (1961)', note: 'A tableau of beggars parodying the composition got the film banned in Spain.' },
    { label: 'Dan Brown, The Da Vinci Code (2003)', note: 'Made the figure of John an object of global speculation, to the despair of art historians.' },
  ],
  summary: 'On the end wall of a dining hall in Milan, a supper has been going on for five hundred years. Leonardo da Vinci painted it between 1495 and 1498 for a convent of Dominican friars, so that they would eat in silence beneath the meal that founded their faith. Every artist before him had painted the Last Supper as a calm row of men. Leonardo chose instead a single sentence, “One of you will betray me”, and let it travel down the table like a shockwave. The apostles recoil, argue, and reach for one another in four groups of three. At the centre, perfectly still, sits Christ, at the exact point where every line of the room converges. It is a masterpiece of composition, and a disaster of chemistry. Leonardo could not bear the speed of true fresco, so he painted on dry plaster with a mixture of his own devising. Within twenty years it was flaking. The friars later cut a door through Christ’s feet. Napoleon’s soldiers stabled horses in the room. In 1943 a bomb took the roof off and the painting survived under sandbags. What remains, after a restoration lasting twenty-one years, is perhaps a fifth of Leonardo’s own hand. And yet the idea is intact: a moment of human panic, arranged with divine geometry. Visitors are allowed fifteen minutes. It is enough.',
},
{
  id: 'mona-lisa', category: 'old',
  title: 'Mona Lisa', artist: 'Leonardo da Vinci', artistDates: '1452 – 1519',
  year: 'c. 1503 – 1519', sort: 1506, medium: 'Oil on poplar', dims: '77 × 53 cm',
  museum: 'Musée du Louvre', city: 'Paris',
  file: 'Mona Lisa, by Leonardo da Vinci, from C2RMF retouched.jpg', w: 7479, h: 11146, wiki: 'Mona_Lisa',
  history: [
    'Begun in Florence around 1503, probably as a portrait of Lisa Gherardini, wife of the silk merchant Francesco del Giocondo. Leonardo never delivered it. He carried the panel with him for the rest of his life, reworking it in Milan, Rome, and finally France, where he died as a guest of King Francis I. The king bought it, and it has belonged to France ever since.',
    'It was admired but not uniquely famous until 21 August 1911, when a Louvre handyman named Vincenzo Peruggia walked out with it under his coat. For two years its empty hooks drew crowds. Picasso was questioned. When it resurfaced in Florence in 1913, it had become the most famous painting on earth.',
  ],
  depicts: [
    'A woman seated in a loggia, turned three-quarters toward us, hands folded, before a landscape of rivers, bridges, and mountains that does not quite line up on either side of her head. She has no eyebrows, which was either fashion or later over-cleaning.',
    'The smile works because Leonardo blurred its corners with sfumato, layers of glaze so thin they are measured in microns. Look straight at the mouth and it fades; look at the eyes and it returns in peripheral vision.',
  ],
  about: [
    'Painter, engineer, anatomist, and famously unreliable, Leonardo finished perhaps fifteen paintings in his life. His notebooks run to thousands of pages on water, flight, and the muscles of the lip. The Mona Lisa is the one work he would not let go of.',
  ],
  echoes: [
    { label: 'Marcel Duchamp, L.H.O.O.Q. (1919)', note: 'A postcard reproduction with a moustache and a rude pun, the founding act of art about art.' },
    { label: 'Andy Warhol, Thirty Are Better Than One (1963)', note: 'Made after the painting toured New York and drew 1.6 million visitors.' },
    { label: 'Nat King Cole, “Mona Lisa” (1950)', note: 'Won the Academy Award for Best Original Song.' },
    { label: 'Walter Pater, The Renaissance (1873)', note: '“She is older than the rocks among which she sits”, the sentence that made her mysterious.' },
  ],
  summary: 'It is a small picture. Visitors are often surprised. Seventy-seven centimetres tall, painted on a plank of poplar that has warped a little over five centuries. Leonardo da Vinci began it in Florence around 1503, most likely as a portrait of a silk merchant’s wife named Lisa. He never handed it over. He carried it with him to Milan, to Rome, and at last to France, still adding glazes so thin that they are measured in millionths of a metre. That is the secret of the smile. He blurred the corners of the mouth so that when you look directly at it, it fades, and when you look at the eyes, it returns. The picture was admired for centuries, but it was not the most famous painting in the world. That happened on a Monday in August, 1911, when a Louvre workman lifted it off the wall and walked out with it under his coat. For two years crowds came to stare at the empty hooks. Picasso was questioned by the police. When the panel resurfaced in Florence, it returned to Paris a celebrity, and it has never stopped being one. Duchamp drew a moustache on her. Warhol printed her thirty times. Nat King Cole sang to her. And still, behind the glass, she sits before a landscape that does not quite match on either side of her head, and smiles, or does not, depending on where you look.',
},
{
  id: 'creation-of-adam', category: 'old',
  title: 'The Creation of Adam', artist: 'Michelangelo', artistDates: '1475 – 1564',
  year: 'c. 1511', sort: 1511, medium: 'Fresco', dims: '280 × 570 cm',
  museum: 'Sistine Chapel', city: 'Vatican City',
  file: 'Michelangelo - Creation of Adam (cropped).jpg', w: 3524, h: 1599, wiki: 'The_Creation_of_Adam',
  history: [
    'Pope Julius II ordered Michelangelo, who insisted he was a sculptor, to paint the Sistine Chapel ceiling in 1508. He worked for four years on scaffolding of his own design, head tilted back, paint dripping into his eyes, and wrote a sonnet complaining that his beard pointed at heaven and his brush left a mosaic on his face. The Creation of Adam was painted in the second campaign, around 1511, and took about sixteen working days.',
    'The ceiling was cleaned between 1980 and 1994, revealing colours so bright that some scholars accused the restorers of stripping Michelangelo’s own shadows. Five million people a year now pass beneath it.',
  ],
  depicts: [
    'God, borne by a swirl of angels and a billowing cloak, reaches out to a languid Adam who has not yet received the spark of life. The fingers do not touch. That gap of a few centimetres is the most reproduced detail in Western art.',
    'In 1990 a physician noticed that the cloak around God traces the outline of a human brain, with the sagittal sulcus and pituitary in place. Michelangelo had dissected corpses; whether he meant it remains argued.',
  ],
  about: [
    'Michelangelo Buonarroti carved the David at twenty-six and the Pietà before that. He resented painting, feuded with Julius II, and later, as an old man, returned to the same chapel to paint the Last Judgement on the altar wall. He lived to eighty-eight and was working on a Pietà the week he died.',
  ],
  echoes: [
    { label: 'Genesis 1:27; Lorenzo Ghiberti’s Gates of Paradise (1425 – 52)', note: 'The Florentine bronze doors have an earlier reclining Adam receiving life.' },
    { label: 'E.T. the Extra-Terrestrial poster (1982)', note: 'The touching fingers made Michelangelo’s gap a Hollywood logo.' },
    { label: 'Frank Meshberger, JAMA (1990)', note: 'The paper proposing the cloak as a cross-section of the brain.' },
    { label: 'Nokia’s 1990s “Connecting People” logo', note: 'Two hands nearly meeting, drawn straight from the ceiling.' },
  ],
  summary: 'High on the ceiling of the Sistine Chapel, two fingers reach for each other and do not touch. Michelangelo painted the gap between them around 1511, in perhaps sixteen days of work, and it has become the most reproduced few centimetres in Western art. He did not want the job. He was a sculptor, he told the Pope, not a painter. Julius the Second was not a man who accepted refusals. So for four years Michelangelo stood on scaffolding of his own design, head bent back, paint dripping into his eyes, and wrote bitter little poems about his beard pointing at heaven. What he made there was a new kind of human body: heroic, muscular, and alive. Adam reclines on a hillside, beautiful and empty, waiting. God arrives on a wind of angels, wrapped in a billowing cloak, and stretches out his hand. In 1990 an American doctor looked at the shape of that cloak and saw a human brain, in cross-section, with the folds and the stem in the right places. Michelangelo had dissected corpses. Whether the brain is intentional, nobody can say. Five million people a year now crane their necks beneath it. A cleaning in the nineteen-eighties revealed colours so bright, pink and green and violet, that some scholars refused to believe them. And the fingers still do not touch. That is the point. The spark is always about to happen.',
},
{
  id: 'school-of-athens', category: 'old',
  title: 'The School of Athens', artist: 'Raphael', artistDates: '1483 – 1520',
  year: '1509 – 1511', sort: 1511, medium: 'Fresco', dims: '500 × 770 cm',
  museum: 'Apostolic Palace', city: 'Vatican City',
  file: '"The School of Athens" by Raffaello Sanzio da Urbino.jpg', w: 3820, h: 2964, wiki: 'The_School_of_Athens',
  history: [
    'Raphael was twenty-five when Julius II summoned him to Rome to decorate the papal apartments, at the same time Michelangelo was painting the Sistine ceiling a few hundred metres away. The Stanza della Segnatura was the Pope’s library, and its four walls celebrate theology, poetry, law, and philosophy. This is philosophy.',
    'The full-size preparatory cartoon survives in Milan, and shows that the brooding figure of Heraclitus in the foreground was added late, after Raphael had sneaked a look at the Sistine ceiling. It is a portrait of Michelangelo.',
  ],
  depicts: [
    'The thinkers of antiquity gathered in an ideal building that looks like Bramante’s design for the new St Peter’s. At the centre Plato, with Leonardo’s face, points upward toward ideas; Aristotle beside him holds his palm toward the earth. Around them Pythagoras writes, Euclid bends with compasses, Diogenes sprawls on the steps, and Raphael himself looks out from the far right edge.',
    'The perspective is so exact that the vanishing point sits between Plato’s and Aristotle’s hands, at eye level for someone standing in the room.',
  ],
  about: [
    'Raphael Sanzio came from Urbino, absorbed Perugino, then Leonardo and Michelangelo, and synthesised them into a grace that became the standard for academic painting for three hundred years. He ran the largest studio in Rome, was architect of St Peter’s, and died on his thirty-seventh birthday. All Rome mourned him.',
  ],
  echoes: [
    { label: 'Plato, Timaeus; Aristotle, Nicomachean Ethics', note: 'The books the two central figures carry.' },
    { label: 'Bramante’s St Peter’s', note: 'The vaulted hall is the new basilica as it was planned, not yet built.' },
    { label: 'The Athenaeum of countless universities', note: 'From murals to logos to the cover of Sting’s “Nothing Like the Sun” LP sleeve of the same era.' },
  ],
  summary: 'In 1509, a young man from Urbino named Raphael was given a wall in the Pope’s private library and asked to paint philosophy. He was twenty-five. Down the corridor, Michelangelo was painting the Sistine ceiling and refusing to let anyone see it. Raphael answered with this: a vast, airy hall in which every great thinker of antiquity has been invited to the same afternoon. At the centre walk Plato and Aristotle. Plato points up, to the world of ideas, and he has been given the face of Leonardo da Vinci. Aristotle holds his palm down towards the earth. Around them, Pythagoras writes in a book, Euclid bends over a slate with his compasses, and Diogenes sprawls on the steps like a man who has given up on furniture. On the far right, a dark-eyed young man in a black cap looks out at us. It is Raphael himself. And in the foreground, added late, sits a brooding figure leaning on a block of marble, alone. That is Michelangelo, painted after Raphael had crept in to see the ceiling and understood what he was up against. The building is not real. It is the new Saint Peter’s, as its architect Bramante imagined it, painted years before the stones were laid. Raphael died on his thirty-seventh birthday. All of Rome, they said, followed the coffin.',
},
{
  id: 'garden-of-earthly-delights', category: 'old',
  title: 'The Garden of Earthly Delights', artist: 'Hieronymus Bosch', artistDates: 'c. 1450 – 1516',
  year: 'c. 1490 – 1510', sort: 1500, medium: 'Oil on oak panels', dims: '206 × 386 cm (open)',
  museum: 'Museo del Prado', city: 'Madrid',
  file: 'The Garden of Earthly Delights by Bosch High Resolution.jpg', w: 30000, h: 17078, wiki: 'The_Garden_of_Earthly_Delights',
  history: [
    'A triptych with no altar and no church, it was probably painted for Engelbert II of Nassau or his nephew Henry III, in whose Brussels palace it was recorded in 1517, a year after Bosch died. Philip II of Spain, a devout collector of Bosch, acquired it in 1591 and hung it in the Escorial. It has been in the Prado since 1939.',
    'Closed, the outer panels show the world on the third day of creation, in grisaille, a glass sphere with God tiny in the corner. Open, it explodes into colour.',
  ],
  depicts: [
    'Left: Eden, with God presenting Eve to a startled Adam, beside a pink fountain and a giraffe. Centre: a world of nude figures feasting on giant strawberries, riding pigs and birds, and cavorting inside eggshells and transparent bubbles. Right: Hell, cold and dark, where a tree-man with a broken body gazes out, a bird-headed demon devours sinners, and music is the instrument of torture.',
    'Whether the centre panel is a warning against lust or a vision of humanity before the Fall, the argument has never been settled. Nothing in it is repeated. It rewards a magnifying glass.',
  ],
  about: [
    'Jheronimus van Aken, who signed himself after his home town of ’s-Hertogenbosch, was a respected member of a religious brotherhood and never left the Low Countries. We have no letters, no drawings of himself, and about twenty-five surviving paintings. Everything else is speculation, which has suited the Surrealists, the psychoanalysts, and the poster industry.',
  ],
  echoes: [
    { label: 'Pieter Bruegel the Elder', note: 'Built his early career on Bosch’s demons and was sold as “the second Bosch”.' },
    { label: 'Salvador Dalí and the Surrealists', note: 'Claimed him as an ancestor; Dalí’s soft forms owe a debt to the eggs and bubbles.' },
    { label: 'The music written on a sinner’s buttocks', note: 'Transcribed and recorded in 2014 as the “Butt Song from Hell”.' },
    { label: 'Michael Jackson, Dangerous album cover (1991)', note: 'Mark Ryden’s cover art is a direct homage.' },
  ],
  summary: 'Close the wings of this triptych and you see the world on the third day of creation: a grey glass sphere, water and land, and God very small in the corner. Open it, and you fall into one of the strangest pictures ever painted. Hieronymus Bosch made it around the year 1500, in a small Dutch town he never really left, for a nobleman’s palace rather than a church. On the left, Eden, with a pink fountain, a giraffe, and God introducing Eve to a startled Adam. In the centre, hundreds of naked figures feast on giant strawberries, ride pigs and birds in procession, and climb inside eggs and soap bubbles. And on the right, hell: dark, frozen, and lit by fire, where a bird-headed demon swallows the damned and a tree with a man’s face looks out at us with an expression of terrible calm. Is the central garden a warning against lust, or a vision of what humanity might have been without the Fall? Five hundred years of scholars have not agreed. What everyone agrees on is that nothing in it repeats. Every figure is invented fresh. Philip the Second of Spain, the most devout king in Europe, loved it enough to hang it in his monastery. The Surrealists claimed Bosch as their grandfather. And someone, in 2014, transcribed the music painted on a sinner’s backside and played it. It is not a cheerful tune.',
},
{
  id: 'calling-of-saint-matthew', category: 'old',
  title: 'The Calling of Saint Matthew', artist: 'Caravaggio', artistDates: '1571 – 1610',
  year: '1599 – 1600', sort: 1600, medium: 'Oil on canvas', dims: '322 × 340 cm',
  museum: 'San Luigi dei Francesi', city: 'Rome',
  file: 'The Calling of Saint Matthew-Caravaggo (1599-1600).jpg', w: 9770, h: 10039, wiki: 'The_Calling_of_Saint_Matthew',
  history: [
    'Caravaggio’s first public commission, for the Contarelli Chapel in the French church in Rome. He was twenty-eight and known mainly for half-length pictures of fruit sellers and card sharps. The chapel had been waiting decades for its paintings; he delivered this and its companion, the Martyrdom, within a year and became the most talked-about painter in the city overnight.',
    'It has never left the chapel. Visitors drop a coin in a box to light it for a minute or two, which is roughly how Caravaggio meant it to be seen.',
  ],
  depicts: [
    'A dim counting-room in contemporary Rome. Matthew the tax collector sits with his cronies in feathered hats over a pile of coins. Christ enters from the right with Peter, half in shadow, and points. A shaft of light follows the gesture across the wall. Matthew, if it is Matthew, points at himself as if to say, “Me?”',
    'Christ’s hand is borrowed from Michelangelo’s Adam, but limp, reversed, and the exact opposite of divine command: an invitation.',
  ],
  about: [
    'Michelangelo Merisi from Caravaggio painted from live models in a dark cellar with a single window, and rejected the idealised bodies of the previous century. He was also violent, repeatedly arrested, and in 1606 killed a man in a brawl over a tennis match. He spent his last four years on the run through Naples, Malta, and Sicily and died on a beach at thirty-eight.',
  ],
  echoes: [
    { label: 'Gospel of Matthew 9:9', note: '“Follow me. And he arose, and followed him.”' },
    { label: 'Michelangelo, The Creation of Adam', note: 'Christ’s pointing hand is Adam’s, an inheritance and a rebuke.' },
    { label: 'Rembrandt, Georges de La Tour, Artemisia Gentileschi', note: 'A whole century of “Caravaggisti” learned tenebrism from this wall.' },
    { label: 'Pope Francis (2013)', note: 'Said he prayed before it as a young man in Rome and identified with Matthew’s “Me?”.' },
  ],
  summary: 'In a side chapel of a church in Rome, a coin in a slot buys you ninety seconds of light. It falls on a painting made in 1600 by a young man named Caravaggio, and for those ninety seconds you understand why Rome lost its head over him. The scene is a tax collector’s office. Five men in the feathered hats of Caravaggio’s own day sit over a pile of coins. From the right, two figures have just entered, one of them Christ, and he is pointing. A blade of light follows his hand across the wall. One of the men at the table points at himself, astonished. Me? That is Matthew, about to leave his money on the table and follow. Look at Christ’s hand. It is copied from Michelangelo’s Adam on the Sistine ceiling, but reversed and relaxed. Not a command. An invitation. Caravaggio painted from living models in a dark cellar with a single high window, and he painted saints with dirty feet. The churchmen were scandalised and the painters were converted. Within a decade, half of Europe was painting in his shadows. He himself was a brawler who killed a man over a tennis match and spent his last years on the run through Naples, Malta, and Sicily. He died on a beach at thirty-eight. The painting has never left this wall. Bring coins.',
},
{
  id: 'night-watch', category: 'old',
  title: 'The Night Watch', artist: 'Rembrandt van Rijn', artistDates: '1606 – 1669',
  year: '1642', sort: 1642, medium: 'Oil on canvas', dims: '363 × 437 cm',
  museum: 'Rijksmuseum', city: 'Amsterdam',
  file: 'The Night Watch - HD.jpg', w: 57813, h: 48438, wiki: 'The_Night_Watch',
  history: [
    'Its real title is The Militia Company of District II under the Command of Captain Frans Banninck Cocq. Eighteen members of the company paid about a hundred guilders each to be included; the captain paid more. It was a group portrait of a civic guard, a genre that usually produced neat rows of faces. Rembrandt produced a play.',
    'It hung in the militia hall, then Amsterdam’s town hall, where in 1715 it was trimmed on all four sides to fit between two doors, losing two figures and the arch on the left. Varnish darkened it until the eighteenth century assumed it showed night. It has been slashed twice and sprayed with acid once, and since 2019 has been restored in public inside a glass chamber in the museum.',
  ],
  depicts: [
    'The company spills forward out of a gateway in confusion and light: the captain in black with a red sash gives an order, his lieutenant in yellow listens, a musketeer loads, another fires, a drummer drums, a dog barks. A small girl in gold, with a dead chicken hanging from her belt, glows in the middle distance. The claws of the chicken are the emblem of the company.',
    'The captain’s hand casts a shadow onto his lieutenant’s coat. It is the moment before the whole thing moves.',
  ],
  about: [
    'Rembrandt was thirty-six and the most successful painter in Amsterdam. His wife Saskia died the year the picture was finished. His taste for buying art and his refusal to paint to order slowly ruined him; he was declared insolvent in 1656 and died poor, still painting self-portraits.',
  ],
  echoes: [
    { label: 'Frans Hals’s militia pieces', note: 'The genre Rembrandt exploded.' },
    { label: 'Peter Greenaway, Nightwatching (2007)', note: 'A film arguing the painting is a coded accusation of murder.' },
    { label: 'Operation Night Watch (2019 – )', note: 'The Rijksmuseum’s live restoration and 717-gigapixel photograph, the largest of any artwork.' },
    { label: 'Rijksmuseum flash mob (2013)', note: 'The company burst into a shopping centre to announce the museum’s reopening.' },
  ],
  summary: 'In 1642, eighteen members of an Amsterdam militia company each paid roughly a hundred guilders to have their portrait painted. They expected what such companies always got: a tidy row of faces. What Rembrandt gave them was a stage. The captain, in black with a red sash, is giving an order. His lieutenant, in pale gold, leans in to listen. Behind and around them, a musketeer loads, another fires, a drummer beats time, a dog barks, and a small girl in a golden dress, with a dead chicken tied to her belt, glows in the middle of the chaos like a lamp. The chicken’s claws, it turns out, were the emblem of the company. The painting is enormous, and it used to be larger. In 1715 the city cut strips off all four sides so it would fit between two doors in the town hall. Two figures were lost. Dirty varnish then darkened it for so long that people assumed it was a night scene, and the name stuck. It has been slashed with a knife twice and sprayed with acid once. Today it is being restored in public, inside a glass room, and has been photographed at a resolution so fine that you can see the individual cracks in the paint. Rembrandt was at the top of his profession when he painted it. His wife died that same year. He would end his life insolvent, still painting his own face.',
},
{
  id: 'las-meninas', category: 'old',
  title: 'Las Meninas', artist: 'Diego Velázquez', artistDates: '1599 – 1660',
  year: '1656', sort: 1656, medium: 'Oil on canvas', dims: '318 × 276 cm',
  museum: 'Museo del Prado', city: 'Madrid',
  file: 'Las Meninas, by Diego Velázquez, from Prado in Google Earth.jpg', w: 26065, h: 30000, wiki: 'Las_Meninas',
  history: [
    'Painted in the Alcázar palace in Madrid for King Philip IV, who hung it in his private study. It was never a public picture; for a century and a half only the royal household and a few painters saw it. Luca Giordano, shown it in 1692, called it “the theology of painting”.',
    'It survived the fire that destroyed the Alcázar in 1734 by being thrown from a window, and entered the Prado at its founding in 1819. The red cross of the Order of Santiago on Velázquez’s chest was added after his death; the king, legend says, painted it himself.',
  ],
  depicts: [
    'The five-year-old Infanta Margarita, attended by two maids of honour, a dwarf, a dog, and a chaperone, in a large room of the palace. Velázquez stands at a huge canvas, brush in hand, looking straight at us. A mirror on the back wall reflects the king and queen, who are apparently standing where we stand, being painted. A courtier pauses in a lit doorway behind.',
    'Who is the subject? The princess, the painter, the monarchs in the mirror, or the viewer? Every answer has been argued at book length.',
  ],
  about: [
    'Velázquez was court painter to Philip IV for nearly forty years and rose to be the palace chamberlain, arranging the king’s rooms and travels. He painted with a loose, exact touch that reads as detail from a distance and as flurries of paint up close. Manet called him “the painter of painters”.',
  ],
  echoes: [
    { label: 'Jan van Eyck, The Arnolfini Portrait (1434)', note: 'Hung in the Spanish royal collection; the mirror device is inherited from it.' },
    { label: 'Pablo Picasso, Las Meninas (1957)', note: 'Fifty-eight variations painted in four months, now in Barcelona.' },
    { label: 'Michel Foucault, The Order of Things (1966)', note: 'Opens with a chapter on this painting as the emblem of classical representation.' },
    { label: 'Salvador Dalí, Francis Bacon, Joel-Peter Witkin', note: 'Reworked the composition for their own purposes.' },
  ],
  summary: 'This is a painting about looking. It was made in 1656, in the palace in Madrid, by Diego Velázquez, who had been painting King Philip the Fourth of Spain for more than thirty years. A little princess, five years old, stands in a great dim room. Her maids of honour bend towards her. A court dwarf and a sleepy dog complete the group. And to the left, at an enormous canvas whose front we cannot see, stands the painter himself, brush in hand, looking directly at us. What is he painting? Look at the mirror on the far wall. It shows the king and queen. They are standing, it seems, exactly where you are standing now. So perhaps you are the subject. Or the princess. Or the painter. Or the painting itself. For three hundred years, philosophers and artists have argued about it. Picasso painted fifty-eight versions in a single summer. A French philosopher opened a book with it. A visiting Italian painter called it the theology of painting. The canvas hung in the king’s private study, and almost nobody saw it. When the palace burned in 1734, it was thrown from a window to save it. On Velázquez’s chest is the red cross of a knightly order he was awarded shortly before he died. It was added afterwards. The story goes that the king painted it on himself.',
},
{
  id: 'girl-with-a-pearl-earring', category: 'old',
  title: 'Girl with a Pearl Earring', artist: 'Johannes Vermeer', artistDates: '1632 – 1675',
  year: 'c. 1665', sort: 1665, medium: 'Oil on canvas', dims: '44 × 39 cm',
  museum: 'Mauritshuis', city: 'The Hague',
  file: '1665 Girl with a Pearl Earring.jpg', w: 12285, h: 14550, wiki: 'Girl_with_a_Pearl_Earring',
  history: [
    'Nobody knows who she is or who commissioned her. The picture is a “tronie”, a Dutch study of a head in exotic costume, not a portrait. It disappears from the record until 1881, when a collector bought it at auction in The Hague for two guilders and thirty cents, encrusted in dirt, and gave it to the Mauritshuis.',
    'It was cleaned in 1994 and examined again in 2018 with every instrument available: the background was originally a deep green curtain, there are eyelashes, and the “pearl” is two strokes of white with no hook to hold it.',
  ],
  depicts: [
    'A young woman turns over her shoulder toward us, lips parted, in a blue and yellow turban of a kind no Dutch girl wore. Light comes from the left and pools on the earring, the eye, the wet lower lip. There is no setting, no story, no room.',
    'The pearl is too large to be real; it is probably glass or tin. It is painted with two touches: a bright highlight and a soft reflection of her collar.',
  ],
  about: [
    'Vermeer lived his whole life in Delft, ran an inn and dealt in pictures, had eleven surviving children, and painted about two canvases a year, most of them women in quiet rooms lit from the left. He died in debt at forty-three and was almost forgotten until a French critic rediscovered him in 1866. Thirty-seven paintings survive.',
  ],
  echoes: [
    { label: 'Tracy Chevalier, Girl with a Pearl Earring (1999); film (2003)', note: 'An invented story of a maid named Griet, with Scarlett Johansson in the turban.' },
    { label: 'Banksy, Girl with a Pierced Eardrum (2014)', note: 'A Bristol wall with a security alarm box for the pearl.' },
    { label: 'Vermeer, Mauritshuis (2023)', note: 'The largest Vermeer exhibition ever, sold out before it opened.' },
  ],
  summary: 'She turns to look at you, as if you had just said her name. Johannes Vermeer painted her in Delft around 1665, and we do not know who she was. The picture is not a portrait but what the Dutch called a tronie, a study of a face in fancy dress. The blue and yellow turban was exotic costume, and the pearl, far too large to be real, was probably glass or tin. Look closely and you will see it is not even a whole pearl. It is two strokes of paint: one bright highlight, and one soft reflection of her white collar. There is no hook holding it to her ear. There is no room, no story, only a dark background, which was once a green curtain that has faded to black. Vermeer painted perhaps two pictures a year, ran an inn, had eleven children, and died in debt at forty-three. For two hundred years hardly anyone remembered him. In 1881 this canvas came up at auction in The Hague, filthy and unregarded, and sold for two guilders and thirty cents. The buyer gave it to a small museum, and there she has stayed, the Mona Lisa of the North, turning over her shoulder with her lips just parted, about to speak or just done speaking. Novelists have invented her life. Banksy put a burglar alarm where the pearl should be. She remains as unknown as the day she was finished.',
},

/* ───────────────────────── NINETEENTH CENTURY ───────────────────────── */
{
  id: 'death-of-marat', category: 'nineteenth',
  title: 'The Death of Marat', artist: 'Jacques-Louis David', artistDates: '1748 – 1825',
  year: '1793', sort: 1793, medium: 'Oil on canvas', dims: '165 × 128 cm',
  museum: 'Royal Museums of Fine Arts', city: 'Brussels',
  file: 'Death of Marat by David.jpg', w: 4045, h: 5205, wiki: 'The_Death_of_Marat',
  history: [
    'On 13 July 1793 the radical journalist Jean-Paul Marat, who spent his days in a medicinal bath for a skin disease, was stabbed there by Charlotte Corday, a young royalist from Normandy. David, a fellow Jacobin who had visited him the day before, was asked by the Convention to organise the funeral and paint the martyr. He delivered the canvas in October, the month Corday was guillotined.',
    'When the Terror ended, David was imprisoned and the painting went into hiding for decades. It was rediscovered by the Romantics, who saw in it the first modern history painting: no gods, no antique costume, a man dead in a bathtub.',
  ],
  depicts: [
    'Marat slumps in his bath, wrapped in a towel, the wound under his collarbone, the knife on the floor, still holding the letter Corday used to gain entry. An assignat and a note giving money to a widow lie on the packing crate he used as a desk. The upper half is empty, painted like a wall of nothing.',
    'David composed him as a secular Pietà, the arm hanging like Christ’s in a Deposition. The crate carries the dedication “À Marat, David”.',
  ],
  about: [
    'David was the painter of the Revolution and then of Napoleon, whom he showed crossing the Alps on a rearing horse he actually crossed on a mule. He voted for the execution of Louis XVI, survived the Terror by a whisker, and died in exile in Brussels, where the painting is now.',
  ],
  echoes: [
    { label: 'Michelangelo, Pietà (1499)', note: 'The dangling arm is borrowed from the marble in St Peter’s.' },
    { label: 'Charles Baudelaire (1846)', note: '“Cruel as nature, this painting has all the perfume of the ideal.”' },
    { label: 'Edvard Munch, The Death of Marat (1907)', note: 'Recast with Munch himself as the victim and his ex-lover as Corday.' },
    { label: 'Vik Muniz, Marat (Sebastião) (2008)', note: 'Recreated in rubbish from a Rio landfill, in the film Waste Land.' },
  ],
  summary: 'On the thirteenth of July, 1793, a young woman from Normandy was admitted to the home of the revolutionary journalist Jean-Paul Marat. He received visitors from his bath; a skin disease kept him in it for hours each day. She handed him a letter, and while he read it, she stabbed him. Jacques-Louis David had visited Marat the day before. He was a Jacobin, a friend, and the greatest painter in France, and within three months he had turned the murder into this. Marat lies in the bath, one arm hanging over the edge, still holding his killer’s letter. On the crate he used as a desk is a note giving money to a soldier’s widow. Above him, half the canvas is empty, just a dark wall. It is a picture of a saint with no God in it. The pose is the Pietà’s. Michelangelo’s dead Christ has become a man in a tub. When the Terror collapsed, David went to prison and the painting went into hiding. The next generation found it again and understood: this was the first modern history painting. No gods, no togas, just a body and a newspaper. David later painted Napoleon on a rearing horse. He died in exile in Brussels, which is where his bathtub martyr hangs today. Munch repainted the scene with himself as the victim. Baudelaire called it as cruel as nature.',
},
{
  id: 'third-of-may-1808', category: 'nineteenth',
  title: 'The Third of May 1808', artist: 'Francisco Goya', artistDates: '1746 – 1828',
  year: '1814', sort: 1814, medium: 'Oil on canvas', dims: '268 × 347 cm',
  museum: 'Museo del Prado', city: 'Madrid',
  file: 'El Tres de Mayo, by Francisco de Goya, from Prado thin black margin.jpg', w: 29294, h: 22626, wiki: 'The_Third_of_May_1808',
  history: [
    'In May 1808 the people of Madrid rose against Napoleon’s occupying army; the next dawn, French firing squads executed hundreds on the hill of Príncipe Pío. Goya, who had painted for both Spanish kings and French administrators, proposed the picture to the restored government in 1814, “to perpetuate by means of the brush the most notable and heroic actions of our glorious insurrection”. He was paid, and the painting was then put in storage for forty years.',
    'It hung unseen through Spain’s bad century, was hit by shrapnel while being evacuated during the Civil War, and only became famous as Europe’s wars caught up with it.',
  ],
  depicts: [
    'A line of faceless soldiers, backs to us, aims at a group of prisoners in the light of a square lantern. One man in a white shirt throws out his arms, a stigma on his right hand, as those beside him cover their faces and those already shot lie in their blood. A queue of the next victims comes up the hill. Behind, a church and a city in darkness.',
    'There is no hero, no composition of triumph, no idealised body. It is night, it is quick, and it is already too late.',
  ],
  about: [
    'Goya was court painter to Charles IV, went profoundly deaf in 1793, and thereafter painted the world as it was: the Disasters of War etchings, the Black Paintings on his own dining room walls, and this. He died in Bordeaux in voluntary exile. He is the last Old Master and the first modern painter, and the Prado has both halves of him.',
  ],
  echoes: [
    { label: 'Édouard Manet, The Execution of Emperor Maximilian (1867 – 69)', note: 'Lifts the firing squad and the lantern wholesale.' },
    { label: 'Pablo Picasso, Massacre in Korea (1951)', note: 'Restages the line of soldiers against women and children.' },
    { label: 'Goya, The Disasters of War (1810 – 20)', note: 'Eighty-two etchings, the private counterpart, unpublished in his lifetime.' },
    { label: 'Robert Hughes on the man in white', note: '“The first image of modern war: the killing of one man by another who does not know him.”' },
  ],
  summary: 'It happened before dawn on the third of May, 1808. The day before, the people of Madrid had risen against Napoleon’s army. Now, on a hill outside the city, French firing squads were working through the prisoners. Six years later, when the French had gone, Francisco Goya asked the Spanish government for money to paint what he called the most heroic actions of the insurrection. What he painted is not heroic. It is a line of soldiers with their backs to us, faceless, rifles level, lit by a single square lantern. In front of them, a man in a white shirt throws out his arms. Beside him, men cover their faces. At his feet lie those already shot. And behind, coming up the hill in a queue, are the next. There is no general on a horse, no flag, no beautiful death. Goya was deaf, nearly seventy, and had painted for kings on both sides. He knew exactly what he was doing. The government paid him and then put the picture in storage for forty years. It did not become famous until Europe’s wars caught up with it. Manet borrowed the firing squad for his Execution of Maximilian. Picasso borrowed it for Korea. Every photograph of an execution you have ever seen was composed by Goya first. Look at the man in white. On his right palm there is a small wound.',
},
{
  id: 'wanderer-above-the-sea-of-fog', category: 'nineteenth',
  title: 'Wanderer above the Sea of Fog', artist: 'Caspar David Friedrich', artistDates: '1774 – 1840',
  year: 'c. 1818', sort: 1818, medium: 'Oil on canvas', dims: '95 × 75 cm',
  museum: 'Hamburger Kunsthalle', city: 'Hamburg',
  file: 'Caspar David Friedrich - Wanderer above the sea of fog.jpg', w: 2327, h: 2980, wiki: 'Wanderer_Above_the_Sea_of_Fog',
  history: [
    'Painted in Dresden around 1818, the year Friedrich married, and assembled from separate sketches of rocks in the Elbe Sandstone Mountains of Saxony; the view does not exist. It was little noticed in his lifetime, and Friedrich himself died half-forgotten, dismissed as a sentimental relic.',
    'The Kunsthalle in Hamburg bought it in 1970, exactly as the twentieth century rediscovered him. Since then it has become the visual shorthand for Romanticism, and the most licensed book cover in philosophy.',
  ],
  depicts: [
    'A man in a green frock coat, hair blowing, stands on a dark crag with his back to us, looking out over a valley filled with fog from which peaks and ridges rise. We see what he sees, and we never see his face. The device is called the Rückenfigur, the figure from behind, and Friedrich made it his signature.',
    'Read as sublime self-assertion, or as a man dwarfed by nature, or as a memorial to a fallen officer in Saxon uniform. The fog keeps its counsel.',
  ],
  about: [
    'Friedrich grew up on the Baltic coast, watched his brother drown through the ice trying to save him, and painted a Protestant north of ruins, moonlight, and bare trees. Goethe wanted his pictures smashed on the edge of a table. Hitler admired him, which hurt his reputation for decades until the 1970s put him back.',
  ],
  echoes: [
    { label: 'Nietzsche, Kant, and the sublime', note: 'The default cover for editions of both, though he predates the one and post-dates the other.' },
    { label: 'Ansel Adams and the mountain photograph', note: 'The figure-before-the-view became a template for landscape photography and later for Instagram.' },
    { label: 'Beyond: Two Souls, The Truman Show, Dead Poets Society', note: 'The pose is quoted whenever a film wants to say “destiny”.' },
  ],
  summary: 'A man stands on a rock with his back to us, and looks out over a sea of cloud. That is all. And yet this modest canvas, painted around 1818 in Dresden, has become the image of an entire way of feeling. Caspar David Friedrich called this device the figure from behind. We see what the man sees. We never see his face. He wears a green frock coat and his hair is stirred by the wind. Below him, fog fills the valleys, and peaks rise from it like islands. The view is not real; Friedrich assembled it from sketches of separate rocks in the Saxon mountains. Is the man the master of all he surveys, or a small creature humbled by the immensity of nature? The painting will not say. Friedrich himself, a Baltic Protestant who had watched his brother drown, thought of landscape as a way of painting God without painting God. In his lifetime he was admired and then mocked. Goethe wanted his pictures smashed. He died half-forgotten. The picture was bought by a Hamburg museum in 1970, exactly as the twentieth century rediscovered him, and it has since appeared on the cover of nearly every paperback edition of Nietzsche, in countless films, and, without anyone quite noticing, in every photograph of a friend standing at a viewpoint, back turned to the camera, looking out.',
},
{
  id: 'raft-of-the-medusa', category: 'nineteenth',
  title: 'The Raft of the Medusa', artist: 'Théodore Géricault', artistDates: '1791 – 1824',
  year: '1818 – 1819', sort: 1819, medium: 'Oil on canvas', dims: '491 × 716 cm',
  museum: 'Musée du Louvre', city: 'Paris',
  file: 'JEAN LOUIS THÉODORE GÉRICAULT - La Balsa de la Medusa (Museo del Louvre, 1818-19).jpg', w: 5872, h: 4008, wiki: 'The_Raft_of_the_Medusa',
  history: [
    'In 1816 the French frigate Méduse ran aground off Senegal through the incompetence of a captain appointed for his royalist connections. The officers took the lifeboats; 147 people were put on a makeshift raft and cut loose. After thirteen days, fifteen were alive. There had been murder and cannibalism. The scandal shook the restored monarchy.',
    'Géricault, twenty-seven and independently wealthy, chose it as the subject of a canvas the size of a history painting about a king. He interviewed survivors, had the ship’s carpenter build a model of the raft, studied severed limbs from the morgue in his studio, and shaved his head to avoid distraction. It caused a sensation at the Salon of 1819 and was bought for the Louvre after his death at thirty-two.',
  ],
  depicts: [
    'The raft at the moment a ship is sighted on the horizon, a speck. The survivors surge upward in a pyramid to a Black sailor waving a cloth. In the foreground, a grey-haired man cradles the corpse of his son and does not look up. Dead bodies slide into the water at the edge.',
    'The tiny rescue ship is the emotional pivot: hope that may be false. In fact the Argus sailed away and only returned hours later.',
  ],
  about: [
    'Géricault painted horses, guillotined heads, and portraits of the insane, and died from a fall from a horse and a lingering tubercular infection. He was Delacroix’s friend and hero; Delacroix posed for one of the dead figures. Everything Romantic painting became begins with this raft.',
  ],
  echoes: [
    { label: 'Michelangelo’s Last Judgement', note: 'The heaped, straining bodies are Sistine damned relocated to the Atlantic.' },
    { label: 'Eugène Delacroix, The Barque of Dante (1822)', note: 'His direct reply.' },
    { label: 'Julian Barnes, A History of the World in 10½ Chapters (1989)', note: 'A whole chapter on how catastrophe becomes art.' },
    { label: 'The Pogues, Asylum Records, Banksy in Calais (2015)', note: 'Album covers and a mural of migrants signalling to a passing yacht.' },
  ],
  summary: 'In July 1816 a French naval frigate called the Medusa ran aground off the coast of West Africa. Her captain, appointed for his loyalty to the king rather than any skill, took to the lifeboats with his officers. One hundred and forty-seven other people were put on a raft of lashed timbers and cut loose. Thirteen days later, fifteen were alive. There had been fighting, and there had been cannibalism. The story became a scandal, and a twenty-seven-year-old painter named Théodore Géricault decided to make it the subject of a canvas as large as a coronation. He interviewed the survivors. He had the ship’s carpenter build him a model of the raft. He brought amputated limbs from the morgue to his studio to study how flesh decays. He shaved his head so he would not go out. What he painted is the moment a ship appears on the horizon, no bigger than a fingernail. The survivors surge upward in a pyramid of bodies, to a Black sailor waving a rag at the sky. In the foreground, an old man holds his dead son and does not look up. In fact the ship sailed away. It came back hours later. Géricault died at thirty-two, after a fall from a horse. The Louvre bought the raft. Everything we call Romantic painting begins here, on these timbers.',
},
{
  id: 'liberty-leading-the-people', category: 'nineteenth',
  title: 'Liberty Leading the People', artist: 'Eugène Delacroix', artistDates: '1798 – 1863',
  year: '1830', sort: 1830, medium: 'Oil on canvas', dims: '260 × 325 cm',
  museum: 'Musée du Louvre', city: 'Paris',
  file: 'Eugène Delacroix - Le 28 Juillet. La Liberté guidant le peuple.jpg', w: 5946, h: 4853, wiki: 'Liberty_Leading_the_People',
  history: [
    'Commemorates the July Revolution of 1830, three days in which Paris rose and threw out Charles X, the last Bourbon king. Delacroix, who did not fight, wrote to his brother: “If I haven’t fought for my country, at least I’ll paint for her.” He finished it in three months. The new king Louis-Philippe bought it, hung it briefly, and then hid it as too inflammatory. It emerged for good in 1874.',
    'It is the picture that made a woman in a Phrygian cap the personification of the Republic; she is on the 100-franc note, and her profile is on every town hall in France.',
  ],
  depicts: [
    'Liberty, bare-breasted, in a yellow dress and the red cap of freed Roman slaves, strides over a barricade of paving stones and corpses holding the tricolour in one hand and a musket in the other. Beside her a boy with two pistols, a top-hatted bourgeois with a shotgun, a worker with a sabre. Notre-Dame stands in the smoke. Bodies, one half-naked, one in uniform, fill the foreground.',
    'She is not an allegory floating above the scene but a fighter in it, with dirt on her feet and hair under her arms, which shocked the critics more than the corpses.',
  ],
  about: [
    'Delacroix was the leader of French Romanticism, Ingres’s great rival, a friend of Chopin and George Sand, and a colourist whose journals on painting became scripture for the Impressionists. He painted North Africa, lions, Shakespeare, and the ceilings of the Louvre and the Senate.',
  ],
  echoes: [
    { label: 'Géricault, The Raft of the Medusa (1819)', note: 'Same pyramid of bodies, this time pointing at victory.' },
    { label: 'Victor Hugo, Les Misérables (1862)', note: 'The boy with pistols is the ancestor of Gavroche, though he predates him by thirty years.' },
    { label: 'Coldplay, Viva la Vida (2008)', note: 'Album cover, with the title scrawled across her.' },
    { label: 'Bartholdi’s Statue of Liberty (1886)', note: 'A calmer, clothed daughter.' },
  ],
  summary: 'In July 1830, Paris rose against its king for three days, and won. Eugène Delacroix did not fight. He wrote to his brother that if he had not fought for his country, at least he would paint for her, and within three months he had. A woman strides over a barricade of paving stones and the dead. She is barefoot, bare-breasted, and wears the red cap that freed slaves wore in ancient Rome. In one hand she holds the tricolour, in the other a musket with a bayonet. Beside her a boy waves two pistols. A gentleman in a top hat carries a shotgun. Notre-Dame stands in the gunsmoke behind. This is Liberty, and what shocked the critics was not the corpses but that she was dirty. She had hair under her arms. She was not a goddess floating above the fight but a woman in it. The new king bought the painting, hung it for a few months, and then put it away as too dangerous. It did not return to public view for forty years. Since then she has been on the hundred-franc note, on a Coldplay album, and, in a calmer, fully clothed form, in New York harbour, holding a torch instead of a gun. Delacroix went on to paint lions, Morocco, and the ceilings of the Louvre. But it is this woman, with dirt on her feet, whom France chose as its face.',
},
{
  id: 'great-wave', category: 'nineteenth',
  title: 'The Great Wave off Kanagawa', artist: 'Katsushika Hokusai', artistDates: '1760 – 1849',
  year: 'c. 1831', sort: 1831, medium: 'Woodblock print, ink and colour on paper', dims: '25 × 37 cm',
  museum: 'Multiple impressions; this one at the Metropolitan Museum', city: 'New York',
  file: 'Tsunami by hokusai 19th century.jpg', w: 3859, h: 2594, wiki: 'The_Great_Wave_off_Kanagawa',
  history: [
    'The first print in Thirty-Six Views of Mount Fuji, published in Edo around 1831, when Hokusai was over seventy and Japan had been closed to the West for two centuries. It was a commercial print sold for roughly the price of a double helping of noodles. Perhaps eight thousand impressions were pulled; a few hundred survive, and the blocks wore out.',
    'The blue is Prussian blue, a synthetic pigment smuggled in through Dutch traders, which is why the sea looks so modern. After Japan opened in the 1850s, prints like this reached Paris as packing paper, and changed Western art.',
  ],
  depicts: [
    'Three fishing boats, their rowers flattened to the hulls, are about to be swallowed by a wave whose crest breaks into claws. In the distance, small and calm, framed by the trough, sits Mount Fuji. The wave is at least ten metres high by the scale of the boats, and its foam is snowing onto the mountain.',
    'It is a landscape in which the land is the smallest thing. The composition reads right to left, as Japanese does, so the wave crashes toward the reader.',
  ],
  about: [
    'Hokusai signed himself “Old Man Mad About Painting”, changed his name thirty times, moved house ninety-three times, and produced perhaps thirty thousand works. He said that at seventy he had still not understood how to draw a bird, and hoped that by a hundred and ten every dot would be alive. He died at eighty-nine, asking for ten more years.',
  ],
  echoes: [
    { label: 'Claude Debussy, La Mer (1905)', note: 'The score’s first edition carried the wave on its cover, at Debussy’s request.' },
    { label: 'Van Gogh, letters (1888)', note: '“These waves are claws, the boat is caught in them, you can feel it.”' },
    { label: 'Rilke, “Der Berg” (1907); the 🌊 emoji', note: 'Unicode’s water-wave glyph is the Great Wave.' },
    { label: 'The 2024 Japanese ¥1000 banknote', note: 'The wave is legal tender.' },
  ],
  summary: 'It cost about the same as a bowl of noodles. Around 1831, in the city we now call Tokyo, a print shop began selling a new series of views of Mount Fuji by an old man who signed himself Hokusai, mad about painting. He was over seventy. The first print in the series showed three fishing boats about to be swallowed by a wave whose crest breaks into claws. Far away, small and serene, framed by the trough of the wave, sits the sacred mountain. The foam seems to be snowing onto it. Perhaps eight thousand impressions were printed until the wooden blocks wore out. A few hundred survive. The blue is Prussian blue, a chemical pigment smuggled into a closed Japan through Dutch traders, which is why the sea looks so startlingly modern. Twenty years later Japan opened, and prints like this reached Paris, sometimes as packing paper around porcelain. Monet collected them. Van Gogh wrote to his brother that the waves were claws and you could feel the boat caught in them. Debussy put it on the cover of La Mer. It is now on the thousand-yen note and inside your phone, as the emoji for a wave. Hokusai died at eighty-nine, asking heaven for ten more years. With five, he said, he might have become a real painter.',
},
{
  id: 'fighting-temeraire', category: 'nineteenth',
  title: 'The Fighting Temeraire', artist: 'J. M. W. Turner', artistDates: '1775 – 1851',
  year: '1839', sort: 1839, medium: 'Oil on canvas', dims: '91 × 122 cm',
  museum: 'National Gallery', city: 'London',
  file: 'The Fighting Temeraire, JMW Turner, National Gallery.jpg', w: 5684, h: 4223, wiki: 'The_Fighting_Temeraire',
  history: [
    'HMS Temeraire, a ninety-eight-gun ship of the line, fought beside Nelson’s Victory at Trafalgar in 1805. In 1838 the Admiralty sold her for scrap, and she was towed up the Thames by two steam tugs to be broken up at Rotherhithe. Turner may or may not have seen it. He painted it the next year, exhibited it with a line of adapted verse, and refused every offer to buy it, calling it “my darling”. He left it to the nation.',
    'In 2005 BBC listeners voted it Britain’s greatest painting. It is on the twenty-pound note, behind Turner’s face.',
  ],
  depicts: [
    'The ghostly white hulk of the old warship, masts bare, is pulled by a small black tug belching fire and smoke. The sun sets in a blaze on the right; a cold moon rises on the left. The direction is wrong, the Temeraire had been stripped of her masts, and she would have been towed the other way. Turner was painting an elegy, not a report.',
    'Sail gives way to steam, wood to iron, the age of Nelson to the age of the engine, in one composition.',
  ],
  about: [
    'Joseph Mallord William Turner, a barber’s son from Covent Garden, entered the Royal Academy at fourteen and painted light itself for sixty years: storms, sunsets, steam, Venice. He was famous for retouching pictures on the gallery wall and for having himself tied to a ship’s mast in a gale, or so he said. He left three hundred paintings and thirty thousand sketches to Britain.',
  ],
  echoes: [
    { label: 'Thomas Campbell, “Ye Mariners of England”', note: 'Turner adapted its lines for the catalogue: “The flag which braved the battle and the breeze, no longer owns her.”' },
    { label: 'Skyfall (2012)', note: 'Bond and Q meet before it; Q calls it “a grand old warship being ignominiously hauled away to scrap”.' },
    { label: 'Mike Leigh, Mr. Turner (2014)', note: 'Timothy Spall grunts his way through its making.' },
  ],
  summary: 'In 1838 the Royal Navy sold an old warship for scrap. Her name was the Temeraire, and in 1805 she had fought beside Nelson’s Victory at Trafalgar. Two small steam tugs towed her up the Thames to be broken up for timber. Turner may have seen it from a boat; he may have read about it in the paper. Either way, the next year he painted this. The old ship is a ghost, pale gold and white, her masts bare. In front of her, small and black, a tug belches fire and smoke. To the right, the sun goes down in a blaze. To the left, a cold sliver of moon is rising. Almost nothing about it is accurate. She had been stripped of her masts. She was towed the other way. The sun could not have set where Turner put it. He was not painting a news report but an elegy: sail giving way to steam, wood to iron, the age of heroes to the age of the engine. He called the picture his darling, refused every offer to sell it, and left it to the nation. In 2005 the British public voted it their favourite painting. It is on the twenty-pound note. In the film Skyfall, James Bond sits before it and is told it is a grand old warship being hauled ignominiously away. He says he sees a bloody big ship. Both are right.',
},
{
  id: 'dejeuner-sur-lherbe', category: 'nineteenth',
  title: 'Le Déjeuner sur l’herbe', artist: 'Édouard Manet', artistDates: '1832 – 1883',
  year: '1863', sort: 1863, medium: 'Oil on canvas', dims: '208 × 264 cm',
  museum: 'Musée d’Orsay', city: 'Paris',
  file: 'Edouard Manet - Luncheon on the Grass - Google Art Project.jpg', w: 5649, h: 4389, wiki: 'Le_Déjeuner_sur_l%27herbe',
  history: [
    'Rejected by the official Salon of 1863 along with some three thousand other works, so many that Napoleon III ordered a separate Salon des Refusés so the public could judge. The public judged: they laughed at it, and it became the most notorious painting in Paris. The Emperor called it immodest.',
    'What offended was not the nudity, which was fine in a myth, but that she was a real woman, Manet’s model Victorine Meurent, unclothed among men in modern coats, looking straight out. It has been called the first modern painting.',
  ],
  depicts: [
    'Two dressed men and a naked woman picnic in a wood; a second woman in a shift bathes in a stream behind. Her clothes and a basket of fruit spill in the foreground. The perspective is deliberately wrong, the bather too large, the light flat, the flesh painted with no half-tones so it looks like a cut-out.',
    'The group is lifted from a Raphael engraving of river gods, by way of Titian’s Pastoral Concert in the Louvre. Manet was quoting the Old Masters in order to break them.',
  ],
  about: [
    'Manet was a well-dressed Parisian bourgeois who wanted official honours and instead got scandal after scandal, from this to Olympia two years later. He never exhibited with the Impressionists but was their older brother and the man they all met at the Café Guerbois. He died at fifty-one after a leg amputation.',
  ],
  echoes: [
    { label: 'Titian/Giorgione, Pastoral Concert (c. 1509); Raimondi after Raphael, Judgement of Paris', note: 'The two sources.' },
    { label: 'Claude Monet, Le Déjeuner sur l’herbe (1865 – 66)', note: 'An enormous reply, later cut into pieces and now in fragments at the Orsay.' },
    { label: 'Pablo Picasso, Déjeuner series (1959 – 62)', note: 'Twenty-seven paintings and hundreds of drawings.' },
    { label: 'Bow Wow Wow, See Jungle! (1981)', note: 'The album cover restaged it with the band, causing a scandal of its own.' },
  ],
  summary: 'In 1863 the jury of the Paris Salon rejected so many paintings that the Emperor ordered a separate exhibition, so the public could judge for themselves. The public came, and the public laughed. What they were laughing at was this. Two men in modern coats sit on the grass in a wood. A woman sits with them, naked, her clothes tossed in a heap beside a basket of fruit. She looks out at us, unembarrassed. Behind, a second woman in a shift wades in a stream, far too large for the distance. Nudes were nothing new. Every Salon was full of them, as long as they were nymphs or goddesses. This one was a real Parisian model named Victorine, and the men were Manet’s brother and his future brother-in-law. The Emperor called it immodest. The critics called the painting clumsy. It is, deliberately. The light is flat, the flesh has no shadows, the perspective does not work. And the whole arrangement is copied from an engraving after Raphael. Manet was quoting the Old Masters in order to break with them. The younger painters understood at once. Monet painted a reply the size of a wall. A century later Picasso painted twenty-seven versions. Manet himself wanted a medal from the establishment. He never got one. He got this instead: the first modern painting.',
},
{
  id: 'impression-sunrise', category: 'nineteenth',
  title: 'Impression, Sunrise', artist: 'Claude Monet', artistDates: '1840 – 1926',
  year: '1872', sort: 1872, medium: 'Oil on canvas', dims: '48 × 63 cm',
  museum: 'Musée Marmottan Monet', city: 'Paris',
  file: 'Monet - Impression, Sunrise.jpg', w: 5773, h: 4478, wiki: 'Impression,_Sunrise',
  history: [
    'Painted from a hotel window in Le Havre, Monet’s home town, one morning in November 1872; astronomers have narrowed it to 13 November at about 7:35. Shown in April 1874 at the first independent exhibition of the group that called itself the Anonymous Society of Painters, in the former studio of the photographer Nadar.',
    'The critic Louis Leroy titled his mocking review “The Exhibition of the Impressionists”, and the name stuck. In 1985 the picture was stolen at gunpoint from the Marmottan and recovered five years later in Corsica.',
  ],
  depicts: [
    'The harbour of Le Havre at dawn: cranes, masts, and smokestacks dissolving in blue mist, two small rowing boats in the foreground, and an orange sun whose reflection is a few broken strokes. The sun is painted at almost the same luminance as the sky, which is why it seems to pulse.',
    'Asked for a title, Monet said it could not pass for a view of Le Havre, so “put Impression”.',
  ],
  about: [
    'Monet painted outdoors in all weathers for sixty years, from the beaches of Normandy to the water lilies of his garden at Giverny, which he built so he would have something to paint. He was poor until he was fifty and then very rich. His last works, made half-blind, are nearly abstract.',
  ],
  echoes: [
    { label: 'Louis Leroy, Le Charivari (25 April 1874)', note: '“Wallpaper in its embryonic state is more finished than that seascape.”' },
    { label: 'J. M. W. Turner', note: 'Monet saw Turner in London in 1870 and denied being influenced, unconvincingly.' },
    { label: 'Donald Olson, Texas State University (2014)', note: 'Used tide tables and weather logs to date the sunrise to the minute.' },
  ],
  summary: 'One November morning in 1872, at about twenty-five to eight, Claude Monet looked out of a hotel window in Le Havre and painted what he saw, quickly, before it changed. Cranes and masts and chimneys dissolving in blue mist. Two small boats. And a sun the colour of an orange, whose reflection on the water is three or four broken strokes. We know the time and the date because an astronomer worked it out from the tides and the weather records. Monet just knew the light. Two years later, he and his friends, refused by the official Salon, put on their own exhibition in a photographer’s studio. Asked for a title, Monet said the picture could hardly pass for a view of Le Havre, so put Impression. A critic pounced. His review was headed The Exhibition of the Impressionists, and it called the painting less finished than wallpaper. The insult became the name of the most popular movement in the history of art. Look at the sun. It is painted at almost exactly the same brightness as the sky around it. That is why it seems to throb. In 1985 the canvas was stolen from its museum at gunpoint. It turned up five years later in Corsica. Monet, who was poor until fifty and then very rich, would go on to paint water lilies for the rest of his life. It all begins with this smudge of orange.',
},
{
  id: 'bal-du-moulin-de-la-galette', category: 'nineteenth',
  title: 'Bal du moulin de la Galette', artist: 'Pierre-Auguste Renoir', artistDates: '1841 – 1919',
  year: '1876', sort: 1876, medium: 'Oil on canvas', dims: '131 × 175 cm',
  museum: 'Musée d’Orsay', city: 'Paris',
  file: 'Pierre-Auguste Renoir, Le Moulin de la Galette.jpg', w: 2200, h: 1639, wiki: 'Bal_du_moulin_de_la_Galette',
  history: [
    'The Moulin de la Galette was an old windmill on the hill of Montmartre turned into an open-air dance hall, where on Sunday afternoons working Parisians came to drink and dance. Renoir rented a studio nearby, carried the canvas there each week with friends’ help, and painted on the spot. His friends posed as the dancers.',
    'Shown at the third Impressionist exhibition in 1877, bought by the painter Gustave Caillebotte, and left by him to the state. A smaller version sold in 1990 for 78 million dollars, then the second highest price ever paid for a painting.',
  ],
  depicts: [
    'A crowd of young men in straw boaters and women in Sunday dresses, dancing, talking, and drinking under acacia trees. Sunlight filters through the leaves and falls in dappled patches on backs and hats and the ground. In the foreground, two sisters from the neighbourhood lean on a bench with a group of Renoir’s painter and writer friends.',
    'No one is looking at the viewer. It is the pleasure of the moment, painted with a softness that would later make Renoir the most reproduced artist of the century.',
  ],
  about: [
    'Renoir began as a painter of porcelain, joined Monet at the Académie Gleyre, and painted people rather than landscapes: bathers, children, lunches, dances. He said a picture should be “something pleasant, cheerful, and pretty”. Crippled by arthritis in old age, he painted with the brush strapped to his hand.',
  ],
  echoes: [
    { label: 'Pablo Picasso, Le Moulin de la Galette (1900)', note: 'His first Paris painting, at the same dance hall, in lamplight and lipstick.' },
    { label: 'Toulouse-Lautrec, At the Moulin de la Galette (1889)', note: 'The same crowd with the sunshine removed.' },
    { label: 'Amélie (2001)', note: 'Montmartre’s cheerful dappled version of itself descends from this.' },
  ],
  summary: 'On Sunday afternoons in the eighteen-seventies, the working people of Montmartre climbed the hill to an old windmill turned dance hall, drank cheap wine, and danced under the acacia trees. In 1876 a young painter named Renoir rented a studio nearby, and each weekend his friends helped him carry a canvas taller than a man to the garden, where he painted the dancers as they danced. The friends posed too, in straw hats. Two sisters from the neighbourhood lean on the bench in the foreground. The remarkable thing is the light. It falls through the leaves in patches, on backs and hats and the pale dress of a girl being led to dance, and on the ground, where the critics thought it looked like grease stains. No one in the picture is looking at us. Everyone is busy with pleasure. Renoir said a painting should be something pleasant, cheerful, and pretty; there were enough unpleasant things in the world already. His friend Caillebotte, who was rich, bought it, and left it to the French state, which was not sure it wanted it. A smaller version of the same scene sold in 1990 for seventy-eight million dollars. Twenty-four years after this afternoon, a teenage Picasso arrived in Paris and painted the same dance hall by night. The trees had gone. So had the sunshine.',
},

/* ─────────────────────────────── MODERN ─────────────────────────────── */
{
  id: 'grande-jatte', category: 'modern',
  title: 'A Sunday Afternoon on the Island of La Grande Jatte', artist: 'Georges Seurat', artistDates: '1859 – 1891',
  year: '1884 – 1886', sort: 1886, medium: 'Oil on canvas', dims: '208 × 308 cm',
  museum: 'Art Institute of Chicago', city: 'Chicago',
  file: 'A Sunday on La Grande Jatte, Georges Seurat, 1884.jpg', w: 20000, h: 13313, wiki: 'A_Sunday_Afternoon_on_the_Island_of_La_Grande_Jatte',
  history: [
    'Seurat spent two years on it, making some sixty studies on the island in the Seine northwest of Paris and then painting in the studio in tiny dots of pure colour meant to fuse in the viewer’s eye. It was the centrepiece of the eighth and last Impressionist exhibition in May 1886, where it announced that Impressionism was over.',
    'The Art Institute of Chicago bought it in 1924, and it has left the building once, in 1958. The zinc yellow pigment has browned, so the grass was once brighter than it is now.',
  ],
  depicts: [
    'Some forty Parisians of every class at rest on the riverbank on a Sunday: a woman with a monkey on a leash, a man in a top hat, soldiers, a girl in white at the exact centre, a rower, a trumpeter, dogs. Everyone is in profile or full face, like figures on an Egyptian frieze, and nobody speaks to anybody.',
    'The frame of painted dots around the edge is Seurat’s own. Stand back and the dots become light; step close and they become a science experiment.',
  ],
  about: [
    'Seurat was a quiet, methodical bourgeois who studied colour theory and optics and invented what he called chromoluminarism and everyone else called pointillism. He died of an infection at thirty-one, leaving seven large paintings and an infant son who died a fortnight later.',
  ],
  echoes: [
    { label: 'Stephen Sondheim, Sunday in the Park with George (1984)', note: 'A Pulitzer-winning musical in which the painting assembles itself on stage.' },
    { label: 'Ferris Bueller’s Day Off (1986)', note: 'Cameron stares into the girl’s face until it dissolves into dots.' },
    { label: 'Chevreul and Ogden Rood on colour', note: 'The optical theories Seurat put into practice.' },
    { label: 'Every pixel', note: 'The dot as unit of image predates the screen by seventy years.' },
  ],
  summary: 'It took two years, sixty preparatory studies, and several million dots. Georges Seurat, a quiet young man who read books on optics, decided that Impressionism was too casual. Instead of mixing colours on the palette, he would place tiny dots of pure colour side by side, and let the eye mix them at a distance. The result, shown in May 1886 at the last Impressionist exhibition, was this: a Sunday afternoon on an island in the Seine, where forty Parisians of every class are frozen at rest. A woman walks a monkey on a leash. A man in a top hat smokes a cigar. A girl in white stands at the exact centre and looks straight at us. Soldiers, a trumpeter, a rower, three dogs. Everyone is seen in perfect profile or full face, like figures on an Egyptian tomb, and nobody is speaking to anybody. Stand back and the dots melt into shimmering light. Step close and they become a scientific experiment. Seurat even painted the frame with dots. He died five years later, at thirty-one, of an infection. The painting went to Chicago in 1924 and has left the building once. It has since become a Broadway musical, and a scene in Ferris Bueller’s Day Off, in which a boy stares into the little girl’s face until it dissolves into points of colour. Which was, of course, the idea.',
},
{
  id: 'starry-night', category: 'modern',
  title: 'The Starry Night', artist: 'Vincent van Gogh', artistDates: '1853 – 1890',
  year: '1889', sort: 1889, medium: 'Oil on canvas', dims: '74 × 92 cm',
  museum: 'Museum of Modern Art', city: 'New York',
  file: 'Van Gogh - Starry Night - Google Art Project.jpg', w: 44567, h: 35291, wiki: 'The_Starry_Night',
  history: [
    'Painted in June 1889 in the asylum of Saint-Paul-de-Mausole at Saint-Rémy-de-Provence, where van Gogh had committed himself after cutting off part of his ear. The view is from his east-facing bedroom window, before sunrise, with the village added from imagination; he was not allowed to paint in his room, so he made it from memory in the studio downstairs.',
    'He thought little of it and did not send it to his brother with his best work. It passed through his sister-in-law’s hands to the Museum of Modern Art in 1941, and has become the most viewed painting in New York.',
  ],
  depicts: [
    'A night sky in violent motion: eleven stars, a crescent moon, and a great spiral of turbulence rolling across the centre, above a sleeping village with a church spire that looks more Dutch than Provençal. In the foreground a cypress flames up like a black torch. Venus is the bright star to the right of the tree, exactly where it was that month.',
    'Physicists have found that the swirls follow the statistical pattern of real turbulent flow. Van Gogh was not well, and he saw clearly.',
  ],
  about: [
    'Vincent van Gogh painted for ten years, produced about 2,100 works, sold perhaps one, and wrote 800 letters, mostly to his brother Theo, that are among the great documents of any artist’s mind. He shot himself in a wheatfield in July 1890, thirteen months after this canvas.',
  ],
  echoes: [
    { label: 'Don McLean, “Vincent” (1971)', note: '“Starry, starry night”, played daily at the Van Gogh Museum.' },
    { label: 'Loving Vincent (2017)', note: 'A feature film painted frame by frame in his style by 125 artists.' },
    { label: 'Kolmogorov turbulence (Aragón et al., 2008)', note: 'The paper showing the swirls match real fluid dynamics.' },
    { label: 'Van Gogh’s letter to Theo, June 1889', note: '“This morning I saw the countryside from my window a long time before sunrise, with nothing but the morning star.”' },
  ],
  summary: 'He painted it from memory, in a corridor, because they would not let him keep paints in his room. In June 1889, Vincent van Gogh was a voluntary patient in an asylum in the south of France. From the barred window of his bedroom he could see the hills before dawn, and one morning he watched the morning star, very large, hanging over them. Downstairs, in a studio, he made this. Eleven stars and a crescent moon, each wrapped in rings of light. A great spiral rolling across the sky like water. Below, a village that looks more Dutch than French, with a spire he invented. And in the foreground, a cypress tree rising like a black flame. Physicists have since measured the swirls and found that they follow the mathematics of real turbulence. He was not well. He was also seeing very clearly. Vincent thought little of the picture. He did not include it among the works he sent his brother. Thirteen months later he shot himself in a wheatfield. He had sold perhaps one painting in his life. The canvas reached New York in 1941, and is now the most visited object in the Museum of Modern Art. Don McLean wrote a song about it. A film was painted, frame by frame, in its style. Somewhere in the world, right now, someone is looking at a print of it on a dormitory wall.',
},
{
  id: 'the-scream', category: 'modern',
  title: 'The Scream', artist: 'Edvard Munch', artistDates: '1863 – 1944',
  year: '1893', sort: 1893, medium: 'Oil, tempera, pastel and crayon on cardboard', dims: '91 × 74 cm',
  museum: 'National Museum', city: 'Oslo',
  file: 'Edvard Munch - The Scream - NG.M.00939 - National Museum of Art, Architecture and Design.jpg', w: 6703, h: 8322, wiki: 'The_Scream',
  history: [
    'Munch wrote the source in his diary: walking with friends on a road above Oslo at sunset, he felt the sky turn blood red, stopped, and “sensed an infinite scream passing through nature”. He made four versions between 1893 and 1910, plus a lithograph. This, the first, is painted on cardboard with a pencil inscription in the corner reading “Could only have been painted by a madman”, in Munch’s own hand.',
    'The 1994 version was stolen from the National Gallery on the opening day of the Lillehammer Olympics and recovered in a sting; the 1910 version was stolen from the Munch Museum in 2004 at gunpoint. A pastel sold in 2012 for 120 million dollars.',
  ],
  depicts: [
    'A hairless figure on a bridge or road clasps its face with both hands and opens its mouth, while the landscape, sky, and fjord dissolve into waves of red and blue. Two figures walk away behind. The road cuts a hard diagonal against the swirl.',
    'The figure is not screaming; it is hearing the scream and shielding itself. The red sky may be a memory of the Krakatoa sunsets of 1883.',
  ],
  about: [
    'Munch lost his mother and favourite sister to tuberculosis as a child, and painted anxiety, jealousy, and death in a series he called The Frieze of Life. He drank heavily, had a breakdown in 1908, recovered, and lived quietly outside Oslo, keeping his paintings around him as “my children”. The Nazis declared him degenerate. Norway put him on the thousand-kroner note.',
  ],
  echoes: [
    { label: 'Wes Craven, Scream (1996)', note: 'The Ghostface mask is the figure’s face.' },
    { label: 'The 😱 emoji', note: 'Unicode’s “face screaming in fear” is a direct citation.' },
    { label: 'Andy Warhol, The Scream (After Munch) (1984)', note: 'Screenprinted in Warhol’s late Munch series.' },
    { label: 'Home Alone poster (1990)', note: 'Macaulay Culkin’s hands-on-cheeks is the pose.' },
  ],
  summary: 'Edvard Munch remembered exactly where it happened. He was walking with two friends on a road above the fjord at Oslo, at sunset. The sky turned the colour of blood. He stopped, exhausted, and leaned on the railing, and, as he wrote in his diary, sensed an infinite scream passing through nature. His friends walked on. In 1893 he painted what he had felt. A figure on a bridge, hairless and sexless, clasps its face and opens its mouth, while the sky and the water and the hills melt into waves of red and blue. The two friends are small figures walking away. Look at the figure again. It is not screaming. It is hearing the scream, and trying to shut it out. Munch made four versions and a print, and kept most of them near him all his life. He called his paintings his children. This first version, painted on cheap cardboard, carries a pencil inscription in the corner. It reads: could only have been painted by a madman. For years people assumed it was vandalism. It is Munch’s own hand. The picture has been stolen twice, once on the opening day of the Winter Olympics, and once at gunpoint, and recovered both times. It has become a horror-film mask, a movie poster, and an emoji on every phone on earth. The scream, it seems, is still passing through nature.',
},
{
  id: 'card-players', category: 'modern',
  title: 'The Card Players', artist: 'Paul Cézanne', artistDates: '1839 – 1906',
  year: '1890 – 1895', sort: 1893, medium: 'Oil on canvas', dims: '47 × 57 cm',
  museum: 'Musée d’Orsay', city: 'Paris',
  file: 'Les Joueurs de cartes, par Paul Cézanne.jpg', w: 6048, h: 4961, wiki: 'The_Card_Players',
  history: [
    'One of five versions Cézanne painted in the early 1890s, using farmhands from his family estate near Aix-en-Provence as models. The earlier ones show four or five figures; he stripped the composition down until two men and a bottle were left. The Orsay canvas is the smallest and, most agree, the most concentrated.',
    'In 2011 the royal family of Qatar bought another version for about 250 million dollars, at the time the highest price ever paid for a painting.',
  ],
  depicts: [
    'Two peasants sit at a small table across from each other, absorbed in their cards. Between them a bottle catches the light and divides the picture in two. The one on the left in a hat smokes a pipe; the tablecloth slides off toward us. Nothing happens. It is a picture of attention.',
    'The men are built like architecture: cylinders of arm and torso, a table that tips forward, a space that is stable and impossible at once. This is what Picasso and Braque saw.',
  ],
  about: [
    'Cézanne was a banker’s son from Aix, a friend of Zola until Zola put him in a novel, and a painter who worked slowly, alone, in Provence, and said he wanted to “make of Impressionism something solid and durable, like the art of the museums”. Matisse and Picasso both called him the father of all of them.',
  ],
  echoes: [
    { label: 'The Le Nain brothers (17th century)', note: 'Their peasant card players in the museum at Aix were Cézanne’s starting point.' },
    { label: 'Picasso and Braque, Cubism (1907 – )', note: 'The stacked cylinders and tilted table are the seeds.' },
    { label: 'Rilke, Letters on Cézanne (1907)', note: 'A poet’s account of standing before the pictures and being changed.' },
  ],
  summary: 'Two men play cards. That is the whole event. Paul Cézanne painted it in the early eighteen-nineties on his family’s estate outside Aix-en-Provence, using farmhands who worked there as models, and he painted it five times, stripping the scene down each time until this was left: two men, a table, a bottle. The bottle stands exactly on the centre line, dividing the picture in half, and catches the only real highlight. The man on the left wears a hat and smokes a pipe. The tablecloth slides towards us. Nobody speaks. Nobody moves. It is a picture of pure attention, and the longer you look, the stranger it gets. The men are built from cylinders. The table tilts forward and is somehow stable. The space is impossible and completely convincing. Cézanne said he wanted to make of Impressionism something solid and durable, like the art in the museums. Twenty years later, a young Spaniard named Picasso stood in front of pictures like this one and saw how to take the world apart. He and Matisse both called Cézanne the father of them all. Cézanne himself was a banker’s son, a difficult man who worked alone in Provence, and lost his oldest friend, Zola, when the novelist put him in a book. One of the other versions of the card players sold in 2011 for a quarter of a billion dollars. This one is small enough to carry under your arm.',
},
{
  id: 'the-kiss', category: 'modern',
  title: 'The Kiss', artist: 'Gustav Klimt', artistDates: '1862 – 1918',
  year: '1907 – 1908', sort: 1908, medium: 'Oil and gold leaf on canvas', dims: '180 × 180 cm',
  museum: 'Belvedere', city: 'Vienna',
  file: 'The Kiss - Gustav Klimt - Google Cultural Institute.jpg', w: 7376, h: 7401, wiki: 'The_Kiss_(Klimt)',
  history: [
    'Painted at the peak of Klimt’s “golden phase”, after he had seen the Byzantine mosaics of Ravenna and while Vienna was the capital of a nervous, brilliant empire. It was shown unfinished at the Kunstschau of 1908 and bought by the Austrian state on the spot for 25,000 crowns, the highest price yet paid for an Austrian painting.',
    'It has never left Vienna. In 2022 the Belvedere sold ten thousand NFT fragments of it for Valentine’s Day.',
  ],
  depicts: [
    'A man in a robe of black and white rectangles bends to kiss a woman kneeling in a robe of circles and flowers, on the edge of a flowered meadow that drops into gold. Only faces, hands, and feet are flesh; everything else is pattern. Her toes curl over the edge.',
    'The identity of the couple is disputed: Klimt and his companion Emilie Flöge, or an anonymous embrace. The square format and gold leaf make it an icon in the Byzantine sense.',
  ],
  about: [
    'Klimt, a gilder’s son, led the Vienna Secession in 1897 with the motto “To every age its art, to art its freedom”. He never married, lived with his mother, wore a blue smock and sandals, and reportedly fathered fourteen children. He died of the Spanish flu in 1918, the same year as his protégé Egon Schiele.',
  ],
  echoes: [
    { label: 'The mosaics of San Vitale, Ravenna (6th century)', note: 'Klimt visited in 1903; the gold and the flat pattern come straight from them.' },
    { label: 'Auguste Rodin, The Kiss (1882)', note: 'Rodin visited Klimt in Vienna in 1902; the two embraces have been paired ever since.' },
    { label: 'Austria’s 100-euro gold coin (2003)', note: 'The painting became currency.' },
    { label: 'Every gift shop in Europe', note: 'Klimt is the most reproduced artist after Van Gogh and Monet.' },
  ],
  summary: 'In 1903 Gustav Klimt travelled to Ravenna and stood in a sixth-century church whose walls were covered in gold mosaic. He came home to Vienna and, for the next few years, painted in gold. This is the summit of that phase. A man bends to kiss a woman who kneels at the edge of a meadow of flowers. Beyond the meadow there is nothing: only gold. The man’s robe is a field of black and white rectangles, the woman’s a field of circles and blossoms. Only their faces and hands and feet are painted as flesh. Look at her toes, curling over the edge of the cliff. Is she yielding, or is she about to fall? Vienna in 1908 was the capital of an empire that was brilliant and anxious, the city of Freud and Mahler and Schoenberg, and it was not sure what to make of Klimt. He led the rebel artists, wore a blue smock and sandals, lived with his mother, and never married. But the Austrian state bought The Kiss before it was even finished, for the highest price ever paid for a painting in the country. It has never left the city. It has been on a gold coin and, more recently, been sold in ten thousand digital fragments as a Valentine’s gift. Klimt died of the influenza of 1918. His couple, on their cliff of gold, are still holding on.',
},
{
  id: 'dance', category: 'modern',
  title: 'Dance (La Danse)', artist: 'Henri Matisse', artistDates: '1869 – 1954',
  year: '1910', sort: 1910, medium: 'Oil on canvas', dims: '260 × 391 cm',
  museum: 'Hermitage Museum', city: 'St Petersburg',
  file: 'La Danse II, par Henri Matisse.jpg', w: 2000, h: 1377, wiki: 'Dance_(Matisse)',
  history: [
    'Commissioned in 1909 by the Moscow textile millionaire Sergei Shchukin for the staircase of his mansion, along with a companion, Music. Matisse painted a first version in blue and pink, now in New York, then this second in three colours only: blue sky, green hill, red bodies. Shchukin panicked at the nudity, cancelled, and then accepted. After the Revolution the Bolsheviks nationalised his house and the painting.',
    'It was hidden from view in the Stalin years as formalist and only returned to the Hermitage walls after the war.',
  ],
  depicts: [
    'Five red figures dance in a ring on a green hill against a blue sky, holding hands, except at the front, where two hands strain to reach each other and do not. The circle is so big it bursts the frame. There is no light source, no shadow, no ground beyond a curve.',
    'The dance is a farandole Matisse had watched on the beach at Collioure, joined to the memory of Cézanne’s bathers and Greek vases.',
  ],
  about: [
    'Matisse, a lawyer’s clerk who took up painting while recovering from appendicitis, led the Fauves, the “wild beasts”, in 1905 and spent the next half-century making colour do the work of drawing. Bedridden after cancer surgery in 1941, he cut painted paper with scissors and made the most joyful art of his life.',
  ],
  echoes: [
    { label: 'Cézanne, The Large Bathers; Greek red-figure vases', note: 'The ring of figures has both ancestors.' },
    { label: 'Matisse, Le Bonheur de vivre (1906)', note: 'The dance first appears as a small ring in the background of this earlier canvas.' },
    { label: 'Keith Haring’s dancing figures', note: 'The direct inheritor of the red bodies.' },
    { label: 'Picasso and Matisse: the rivalry', note: 'Picasso called Matisse the only real rival; the two exchanged paintings for decades.' },
  ],
  summary: 'Five red figures dance in a ring on a green hill under a blue sky. That is all there is. No light, no shadow, no faces to speak of, three colours. In 1909 a Moscow textile millionaire named Sergei Shchukin asked Henri Matisse to paint two enormous canvases for the staircase of his mansion. Matisse made this one first in pale blue and pink, and then, dissatisfied, painted it again in colours so strong they seem to hum. Shchukin, seeing the nudity, panicked and cancelled the order, then wrote a shamefaced letter and accepted it after all. He hung it at the top of his stairs. A few years later the Revolution took his house and his paintings, and under Stalin this one was hidden away as decadent. Look at the two hands at the front of the circle. They are reaching for each other and not quite touching. The dancers are moving so fast that the ring has broken, and the whole circle is about to burst out of the frame. Matisse had watched fishermen dance a farandole on a beach in the south of France, and he had looked at ancient Greek vases, and at Cézanne’s bathers. Out of them he made this. He said he wanted an art like a good armchair, something to rest in. This is an armchair spinning at speed.',
},
{
  id: 'composition-vii', category: 'modern',
  title: 'Composition VII', artist: 'Wassily Kandinsky', artistDates: '1866 – 1944',
  year: '1913', sort: 1913, medium: 'Oil on canvas', dims: '200 × 300 cm',
  museum: 'Tretyakov Gallery', city: 'Moscow',
  file: 'Composition VII - Wassily Kandinsky, GAC.jpg', w: 7015, h: 4661, wiki: 'Composition_VII',
  history: [
    'Kandinsky prepared it for over a year with more than thirty studies, then, according to his companion Gabriele Münter, painted the whole canvas in four days in November 1913 in Munich. It is the largest and most complex of his ten numbered Compositions, made in the months when he was writing that painting should be like music, free of objects.',
    'Nine months later the First World War sent him back to Russia. The painting stayed with him, went to the Tretyakov after the Revolution, and was denounced under Stalin but never destroyed.',
  ],
  depicts: [
    'Nothing, and everything: a whirlpool of colour and line in which the traces of the Deluge, the Resurrection, the Last Judgement, and the Garden of Eden, themes of his earlier work, have dissolved into pure motion. A boat with oars can be found at lower left, if you insist.',
    'Kandinsky had synaesthesia and heard colours; yellow was a trumpet, blue a cello. He intended it to be experienced as a symphony is, over time.',
  ],
  about: [
    'Kandinsky was a Moscow law professor who gave up his career at thirty after seeing a Monet haystack and not recognising the haystack. He co-founded the Blue Rider group in Munich, taught at the Bauhaus, was declared degenerate by the Nazis, and died in Paris. His book, Concerning the Spiritual in Art, is still in print.',
  ],
  echoes: [
    { label: 'Arnold Schoenberg’s atonal music (1911)', note: 'Kandinsky heard a concert in January 1911 and wrote to the composer the next day; they became allies.' },
    { label: 'Monet, Haystacks (1890 – 91)', note: 'The paintings that made him a painter.' },
    { label: 'Abstract Expressionism', note: 'Pollock and Gorky studied him at the Guggenheim, which was founded to collect him.' },
  ],
  summary: 'Wassily Kandinsky was a professor of law in Moscow when, at the age of thirty, he saw a painting of a haystack by Monet and did not realise it was a haystack. He gave up the law. Seventeen years later, in Munich, in November 1913, he spent four days painting this. He had prepared for over a year, in more than thirty studies. Then, according to the woman who lived with him, he painted the whole three-metre canvas almost without stopping. There is no object in it. Or rather, there are ghosts of objects: a flood, a resurrection, the day of judgement, all subjects he had painted before, dissolved into a whirlpool of colour and line. If you insist, there is a boat with oars at lower left. Kandinsky heard colours. Yellow was a trumpet, blue a cello. He had gone to a concert of Schoenberg’s atonal music two years before and written to the composer the next morning, and he wanted painting to do what that music did: to work on the soul directly, without a story in between. He believed this so seriously that he called his book Concerning the Spiritual in Art. Nine months after this picture, the war sent him home to Russia. Stalin’s critics called it degenerate. The Nazis said the same. It survived them both, and hangs in Moscow, humming.',
},
{
  id: 'black-square', category: 'modern',
  title: 'Black Square', artist: 'Kazimir Malevich', artistDates: '1879 – 1935',
  year: '1915', sort: 1915, medium: 'Oil on linen', dims: '79.5 × 79.5 cm',
  museum: 'Tretyakov Gallery', city: 'Moscow',
  file: 'Kazimir Malevich, 1915, Black Suprematic Square, oil on linen canvas, 79.5 x 79.5 cm, Tretyakov Gallery, Moscow.jpg', w: 1718, h: 1718, wiki: 'Black_Square',
  history: [
    'First shown in December 1915 at the “Last Futurist Exhibition 0,10” in Petrograd, hung high across the corner of the room, where the icon hangs in a Russian home. Malevich called it the “zero of form” and the founding work of Suprematism, the supremacy of pure feeling. He dated it 1913, the year he first drew a black square as a stage curtain for the opera Victory over the Sun.',
    'X-rays in 2015 found two earlier coloured compositions beneath the paint, and a pencil inscription that appears to read “Battle of negroes in a dark cave”, a reference to an 1897 joke painting by Alphonse Allais. The surface is now a web of cracks. Malevich made four versions; one was buried with him.',
  ],
  depicts: [
    'A black square, not quite square and not quite black, on a white ground, not quite white. The edges are hand-painted and slightly off true. The black is a mix of pigments, the white a warm off-white; both have cracked to show the colours beneath.',
    'It depicts, Malevich said, nothing, in the sense that a hole depicts nothing: the end of representation and the beginning of something else.',
  ],
  about: [
    'Malevich, born in Kyiv to Polish parents, went from Impressionism to Cubism to Suprematism in a decade, taught at Vitebsk with Chagall and Lissitzky, was arrested in 1930, and was forced back to figurative painting under Stalin. At his funeral in 1935, mourners carried a black square, and his ashes were buried under an oak beneath a cube marked with one.',
  ],
  echoes: [
    { label: 'Alphonse Allais, Combat de nègres dans une cave pendant la nuit (1897)', note: 'The joke all-black canvas Malevich was answering, and possibly citing.' },
    { label: 'Ad Reinhardt, Black Paintings (1960s); Rauschenberg’s White Paintings (1951)', note: 'The mid-century descendants.' },
    { label: 'Tatlin, Lissitzky, Rodchenko, the Bauhaus', note: 'Constructivism and geometric abstraction start here.' },
    { label: 'Instagram’s Blackout Tuesday (2020)', note: 'Millions of black squares posted in a day, a hundred and five years later.' },
  ],
  summary: 'In December 1915, in a gallery in Petrograd, a painter named Kazimir Malevich hung a black square on a white ground high across the corner of the room. In a Russian home, that corner is where the icon hangs. He knew what he was doing. He called the painting the zero of form, and the face of a new art, and said he had painted nothing, the way a hole is nothing. Look at it and the first thing you notice is that it is not quite square, and not quite black. The edges wander. The surface has cracked into a map of tiny rivers, and through the cracks you can see colour underneath. In 2015, X-rays found two earlier paintings beneath it, and a pencil note in the margin, which appears to refer to a joke painting from 1897: an all-black canvas titled Battle of Negroes in a Cave at Night. Malevich, it seems, knew the joke, and meant something else by it. Under Stalin he was arrested and forced to paint peasants with faces again. When he died in 1935, mourners carried a black square through the streets, and his ashes were buried beneath a cube painted with one. A century later, on a single Tuesday in June, millions of people posted a black square online to signal a protest. Most had never heard his name. The zero of form was still working.',
},
{
  id: 'composition-red-blue-yellow', category: 'modern',
  title: 'Composition II in Red, Blue, and Yellow', artist: 'Piet Mondrian', artistDates: '1872 – 1944',
  year: '1930', sort: 1930, medium: 'Oil on canvas', dims: '46 × 46 cm',
  museum: 'Kunsthaus Zürich', city: 'Zürich',
  file: 'Piet Mondriaan, 1930 - Mondrian Composition II in Red, Blue, and Yellow.jpg', w: 5918, h: 6000, wiki: 'Composition_II_in_Red,_Blue,_and_Yellow',
  history: [
    'Painted in Paris in 1930, midway through the two decades Mondrian spent reducing painting to horizontal and vertical black lines and the three primaries on white, an approach he called Neoplasticism and preached through the Dutch movement De Stijl. He painted hundreds of variations; this is one of the purest.',
    'Mondrian fled Paris for London in 1938 and London for New York in 1940, where jazz and the grid of Manhattan loosened him up. He died there in 1944, having never, he said, painted a single curve since 1917.',
  ],
  depicts: [
    'A large red square dominates the upper right; a small blue rectangle sits lower left, a sliver of yellow at bottom right, white elsewhere, all divided by black lines of varying thickness that stop before the edge or run off it. The balance is asymmetric and exact. Move any line and it fails.',
    'The lines are not quite uniform and the whites are not one white. Up close the surface is hand-made, ridged, and slightly anxious.',
  ],
  about: [
    'Mondrian began as a Dutch landscape painter of windmills and trees, passed through Theosophy and Cubism, and arrived at a belief that art should express universal harmony through the fewest possible means. He lived in bare white studios, loved dancing, and hated green. Van Doesburg’s diagonal lines ended their friendship.',
  ],
  echoes: [
    { label: 'Yves Saint Laurent, the Mondrian dress (1965)', note: 'Six cocktail dresses that turned the grid into fashion.' },
    { label: 'Gerrit Rietveld, Red and Blue Chair (1923) and Schröder House (1924)', note: 'De Stijl in furniture and architecture.' },
    { label: 'Mondrian, Broadway Boogie Woogie (1943)', note: 'His last finished work, the grid dancing.' },
    { label: 'L’Oréal, Nike, the Partridge Family bus', note: 'The most imitated composition in graphic design.' },
  ],
  summary: 'By 1930 Piet Mondrian had spent thirteen years painting nothing but straight lines and three colours, and had become very good at it. This is one of the purest results. A large red square. A small blue one. A sliver of yellow. White everywhere else. Black lines of slightly different thicknesses, some of which stop before the edge and some of which run off it. Move any single line a centimetre and the whole thing collapses. That was the point. Mondrian had started as a Dutch painter of windmills and trees and, by way of Theosophy and Cubism, had arrived at a belief that art should express universal balance with the fewest possible means. He lived in bare white studios in Paris, arranged his furniture on the same grid, loved to dance the foxtrot, and could not bear the colour green. When his closest ally began painting diagonal lines, he ended the friendship. Stand close to the canvas and the purity dissolves: the whites are several whites, the lines are ridged with brushwork, the surface is human and a little nervous. He fled Paris for London and then New York, where jazz loosened him up at last. He died in 1944. Twenty years later Yves Saint Laurent turned this into a cocktail dress, and it has been on chairs, buses, shoe boxes, and shampoo bottles ever since. Harmony, it turns out, sells.',
},
{
  id: 'american-gothic', category: 'modern',
  title: 'American Gothic', artist: 'Grant Wood', artistDates: '1891 – 1942',
  year: '1930', sort: 1930, medium: 'Oil on beaverboard', dims: '78 × 65 cm',
  museum: 'Art Institute of Chicago', city: 'Chicago',
  file: 'Grant Wood - American Gothic - Google Art Project.jpg', w: 4973, h: 6001, wiki: 'American_Gothic',
  history: [
    'Wood saw a small white house with a Gothic window in Eldon, Iowa, in August 1930, sketched it on the back of an envelope, and painted it in his studio in Cedar Rapids with his sister Nan and his dentist, Dr Byron McKeeby, as models. He entered it in the Art Institute of Chicago’s annual show that autumn, won a bronze medal and 300 dollars, and the museum bought it.',
    'Iowans were offended, thinking themselves mocked; a farmer’s wife threatened to bite off Wood’s ear. Then the Depression deepened and the couple came to stand for endurance. It has not left Chicago except to tour in 2016, its first trip outside North America.',
  ],
  depicts: [
    'A stern farmer with a pitchfork and a woman in a colonial-print apron with a cameo brooch stand before a carpenter-Gothic farmhouse. The pitchfork’s three tines are echoed in his overalls, the window, and the shirt seams. She looks off to the side; he looks straight at us. A loose curl escapes her tight hair.',
    'Wood said they were a farmer and his daughter, not husband and wife. Nan, tired of being called the farmer’s wife, insisted on this for the rest of her life.',
  ],
  about: [
    'Grant Wood was a Regionalist, part of a movement that turned away from Paris to paint the American Midwest. He had studied in Munich and looked hard at Flemish primitives like van Eyck, whose precision and Gothic frames are in this picture. He taught at the University of Iowa and died of cancer the day before his fifty-first birthday.',
  ],
  echoes: [
    { label: 'Jan van Eyck, Hans Memling', note: 'The Flemish portrait tradition Wood saw in Munich, in overalls.' },
    { label: 'Gordon Parks, American Gothic (1942)', note: 'A photograph of a Black cleaner in Washington with mop and broom before the flag.' },
    { label: 'The Rocky Horror Picture Show, The Simpsons, Green Acres', note: 'Parodied more than any other American painting.' },
    { label: 'Beyoncé and Jay-Z, “Apeshit” (2018)', note: 'Restaged, in the Louvre, in one frame.' },
  ],
  summary: 'In August 1930, driving through the small town of Eldon, Iowa, a painter named Grant Wood noticed a white wooden house with a pointed window borrowed from a cathedral. He sketched it on the back of an envelope. Then he went home and asked his sister and his dentist to pose. The dentist got a pitchfork. His sister got an apron with a cameo brooch and her hair pulled tight, with one curl escaping. Wood put them in front of the house and painted them with the hard clarity of the Flemish masters he had studied in Munich. He entered the picture in a show in Chicago and won a bronze medal and three hundred dollars. The museum bought it. Iowa was furious. Farmers thought they were being mocked. One farmer’s wife threatened to bite off his ear. Then the Depression deepened, and the couple began to look less like a joke and more like a promise: that these people, at least, would not bend. Wood always said they were a farmer and his daughter, not a married couple. His sister, tired of being called the farmer’s wife, insisted on this for sixty years. Look at the pitchfork. Its three tines reappear in the seams of his overalls, in the window, in his shirt. It has been parodied more than any other American painting, with cats, presidents, and cartoon families. Nobody parodies what they do not recognise.',
},
{
  id: 'nighthawks', category: 'modern',
  title: 'Nighthawks', artist: 'Edward Hopper', artistDates: '1882 – 1967',
  year: '1942', sort: 1942, medium: 'Oil on canvas', dims: '84 × 152 cm',
  museum: 'Art Institute of Chicago', city: 'Chicago',
  file: 'Nighthawks by Edward Hopper 1942.jpg', w: 6000, h: 3274, wiki: 'Nighthawks_(Hopper)',
  history: [
    'Painted in Hopper’s Greenwich Village studio in the weeks after Pearl Harbor, when New York was practising blackouts. Hopper said it was suggested by a restaurant on Greenwich Avenue where two streets meet, though nobody has ever found the diner. His wife Jo posed for the woman and kept the ledger: “Night + brilliant interior of cheap restaurant.” The Art Institute of Chicago bought it within months for 3,000 dollars.',
    'It has been Hopper’s most famous painting from the day it was finished, and the definitive image of American loneliness.',
  ],
  depicts: [
    'Three customers and a counterman inside a glass-fronted diner on an empty street corner at night. A man and a red-haired woman sit together but do not touch; a second man sits with his back to us. There is no door to the street. The fluorescent light, new in the 1940s, spills onto the pavement. Across the road, dark shop windows.',
    'The wedge of glass is the whole drama. We are outside, and so, in a sense, are they.',
  ],
  about: [
    'Hopper was a tall, silent man from Nyack who worked as a commercial illustrator until forty, then painted empty rooms, gas stations, hotel lobbies, and women looking out of windows for four decades. He and Jo, also a painter, fought and stayed together for forty-three years. He said, “Maybe I am not very human. What I wanted to do was to paint sunlight on the side of a house.”',
  ],
  echoes: [
    { label: 'Ernest Hemingway, “The Killers” (1927)', note: 'Hopper admired the story of two men in a diner; its mood is here.' },
    { label: 'Ridley Scott, Blade Runner (1982)', note: 'Scott kept a reproduction on set to show the mood he wanted.' },
    { label: 'Gottfried Helnwein, Boulevard of Broken Dreams (1984)', note: 'Bogart, Dean, Monroe, and Elvis in the booths; the poster in every dorm.' },
    { label: 'The Simpsons, Banksy, Tom Waits’s Nighthawks at the Diner (1975)', note: 'The list of parodies is longer than for any painting but the Mona Lisa.' },
  ],
  summary: 'It was painted in the weeks after Pearl Harbor, when New York was rehearsing blackouts and the night felt newly dangerous. Edward Hopper, a tall, silent man who had spent twenty years as a commercial illustrator before anyone bought his paintings, made a diner on an empty corner. Inside, under a fluorescent light that was still a novelty, sit three customers and a counterman in white. A man and a red-haired woman side by side, not quite touching. Another man with his back to us. Nobody speaks. There is no door. Look for one: there is no way in from the street, and no way out. Hopper said the picture was suggested by a restaurant where two streets meet in Greenwich Village. People have searched for it for eighty years and never found it. His wife Jo, who posed for the woman, wrote the entry in his ledger: night, and the brilliant interior of a cheap restaurant. Chicago bought it within months. Ridley Scott kept a print on the set of Blade Runner to show what he wanted. Tom Waits named an album after it. It has been redrawn with Marilyn and Elvis in the booths, with the Simpsons, with cartoon characters, and with nobody at all. Hopper once said that perhaps he was not very human, and that all he had wanted was to paint sunlight on the side of a house. This is what he painted instead.',
},
/* ─────────────────── OLD MASTERS, ADDED SEPTEMBER 2026 ─────────────────── */
{
  id: 'primavera', category: 'old',
  title: 'Primavera', artist: 'Sandro Botticelli', artistDates: 'c. 1445 – 1510',
  year: 'c. 1480', sort: 1480, medium: 'Tempera on panel', dims: '202 × 314 cm',
  museum: 'Uffizi Gallery', city: 'Florence',
  file: 'Botticelli-primavera.jpg', w: 4926, h: 3236, wiki: 'Primavera_(Botticelli)',
  tags: ['myth'],
  history: [
    'Painted for a Medici household and hung for centuries at the villa of Castello beside the Birth of Venus, with which it has been paired ever since. It is a panel, not a canvas, and it is enormous for one: six of them joined, carrying some five hundred identified species of plant, of which around two hundred are in flower.',
    'Nobody has ever agreed on what it means. It has been read as a Neoplatonic allegory of love ascending from the physical to the divine, as a wedding picture, as a calendar of spring months, and as a straightforward pastoral. Vasari, writing sixty years later, called it simply “Spring”, and the name stuck.',
  ],
  depicts: [
    'Nine figures in an orange grove. At the right, the blue wind Zephyr seizes the nymph Chloris, who transforms into Flora, the flowered figure stepping forward and scattering blooms. At the centre stands Venus; above her, a blindfolded Cupid aims. At the left the three Graces dance, and Mercury, in the corner, reaches up to disperse a cloud with his staff.',
    'The action runs right to left, against the way a European eye reads, which is part of why the picture feels like a procession that has stopped rather than a story. Nobody looks at anybody else.',
  ],
  about: [
    'Botticelli spent his whole life in Florence, trained under Fra Filippo Lippi, and painted for the circle of poets and philosophers around Lorenzo de’ Medici. In old age he fell under the sway of Savonarola, who preached against exactly this kind of pagan beauty. He died poor and out of fashion, and was forgotten for three hundred years until the Pre-Raphaelites found him again.',
  ],
  echoes: [
    { label: 'Botticelli, The Birth of Venus (c. 1485)', note: 'Its companion at Castello, and its opposite: one a procession, one an arrival.' },
    { label: 'Angelo Poliziano, Rusticus and the Stanze', note: 'The Medici poet’s verses on Zephyr and Flora are the closest thing to a source.' },
    { label: 'Lady Gaga, ARTPOP (2013)', note: 'Botticelli’s Venus on the sleeve; the Primavera Graces in the tour staging.' },
  ],
  summary: 'In a Florentine orange grove, nine figures stand in an arrangement that nobody has ever fully explained. We call it Primavera, Spring, because Vasari called it that sixty years after it was painted, and because the ground is carpeted with flowers — five hundred species of plant, two hundred of them in bloom, painted with the attention of a botanist. At the right, the blue-green wind Zephyr bursts through the trees and seizes a nymph. Flowers spill from her mouth. She becomes Flora, who steps forward in a dress embroidered with the spring itself, scattering roses. At the centre, Venus, not the naked goddess of the sea but a clothed and slightly weary woman, raises one hand. Blindfolded above her, Cupid aims an arrow at the dancing Graces. And at the far edge, Mercury turns his back on the whole scene and pokes at a cloud with his staff. Nobody in this picture looks at anybody else. The action runs from right to left, against the grain of a reading eye, which is why it feels less like a story than a procession that has halted. Scholars have called it a wedding gift, a Neoplatonic ladder from earthly to divine love, a calendar of the spring months. It was painted for the Medici, hung at a villa outside the city, and forgotten for three centuries. Then the Victorians rediscovered Botticelli, and it became one of the most looked-at paintings on earth.',
},
{
  id: 'hunters-in-the-snow', category: 'old',
  title: 'The Hunters in the Snow', artist: 'Pieter Bruegel the Elder', artistDates: 'c. 1525 – 1569',
  year: '1565', sort: 1565, medium: 'Oil on panel', dims: '117 × 162 cm',
  museum: 'Kunsthistorisches Museum', city: 'Vienna',
  file: 'Pieter Bruegel the Elder - Hunters in the Snow (Winter) - Google Art Project.jpg', w: 6819, h: 4853, wiki: 'The_Hunters_in_the_Snow',
  tags: ['landscape'],
  history: [
    'One of a series of six panels on the months, painted in a single year for the Antwerp merchant Niclaes Jonghelinck, who hung them in his suburban house. Five survive. They are the moment European painting decided that landscape alone, with no saint or story to justify it, was enough.',
    'The winter of 1564–65 was one of the bitterest on record, at the start of what climatologists now call the Little Ice Age. Bruegel had seen the Alps on his way back from Italy, and the jagged peaks behind a Flemish village are a memory of that crossing rather than anything you could stand in front of.',
  ],
  depicts: [
    'Three hunters trudge home with a single fox between them and a straggle of thin dogs, heads down. Below them the land drops away to frozen ponds where villagers skate, play a game with sticks, and light a fire outside an inn. A magpie sits in a bare tree. Smoke goes up straight in the cold.',
    'The hunt has failed. Everything in the picture leans downhill and to the right, following the diagonal of the trees, so the eye is walked out of the foreground and into the valley whether it wants to go or not.',
  ],
  about: [
    'Bruegel was the most learned painter of his generation pretending not to be. He signed himself a peasant painter and was a friend of humanists and cartographers; he went to Italy and came back interested in weather rather than antiquity. He died at about forty-four, leaving two sons who copied him for decades.',
  ],
  echoes: [
    { label: 'Andrei Tarkovsky, Solaris (1972)', note: 'The camera moves across the panel for minutes; it is the last of Earth the film shows.' },
    { label: 'William Carlos Williams, Pictures from Brueghel (1962)', note: 'A Pulitzer-winning sequence, opening on this picture.' },
    { label: 'Lars von Trier, Melancholia (2011)', note: 'The painting burns in the opening sequence as the world ends.' },
  ],
  summary: 'Three hunters come back over a hill with one fox and nothing else. Their dogs are thin and their heads are down, and the snow they are walking through is the snow of the winter of 1564, one of the coldest Europe had recorded, at the beginning of what we now call the Little Ice Age. Pieter Bruegel painted this as one of six panels on the months of the year, for a merchant in Antwerp to hang in his house outside the city. It is the picture in which European painting decided that a landscape did not need a saint in it to be worth making. Everything leans downhill. The line of trees, the slope of the ridge, the hunters themselves, all tip the eye to the right and down into the valley, where the land opens out into frozen ponds. Look there and the picture changes register entirely: villagers are skating, sliding, playing a game with sticks and a stone, and a fire is going outside the inn on the left, where a sign hangs crooked. A magpie sits in a bare tree. The smoke rises straight up, which means no wind, which means bitter cold. Behind the village are mountains that do not exist in Flanders; Bruegel had crossed the Alps coming home from Italy and brought them back with him. The result is one of the few paintings that the word masterpiece does not embarrass.',
},
{
  id: 'venus-of-urbino', category: 'old',
  title: 'Venus of Urbino', artist: 'Titian', artistDates: 'c. 1488 – 1576',
  year: '1534', sort: 1534, medium: 'Oil on canvas', dims: '119 × 165 cm',
  museum: 'Uffizi Gallery', city: 'Florence',
  file: 'Tiziano - Venere di Urbino - Google Art Project.jpg', w: 3000, h: 2110, wiki: 'Venus_of_Urbino',
  tags: ['myth', 'portrait'],
  history: [
    'Bought in 1538 by Guidobaldo della Rovere, later Duke of Urbino, who in his letters simply calls it “the naked woman”. The title Venus came afterwards and does a certain amount of work: there is no shell, no sea, no attribute of a goddess anywhere in the room.',
    'It descended to the Medici and has been in Florence since. Mark Twain, visiting in 1880, called it the foulest, the vilest, the obscenest picture the world possesses, and then wrote several hundred more words about it, which is its own kind of tribute.',
  ],
  depicts: [
    'A young woman lies on rumpled sheets in a Venetian bedroom, looking directly out. She holds roses in one hand. A small dog sleeps at her feet. Behind a screen, two servants bend over a chest, and beyond them a window shows a sky going dark.',
    'The domestic detail is the argument. The dog is fidelity, the chest is a bride’s cassone, the myrtle on the sill is Venus’s plant and a marriage emblem. Whether the picture is a wedding gift instructing a young wife, or a courtesan painted for a duke, has never been settled.',
  ],
  about: [
    'Titian ran the most successful workshop in Europe for sixty years and was made a count palatine by Charles V, who is said to have picked up his dropped brush. He painted altarpieces, emperors, and mythologies with equal appetite, and in old age applied paint with his fingers. He died in Venice during the plague of 1576.',
  ],
  echoes: [
    { label: 'Giorgione, Sleeping Venus (c. 1510)', note: 'The pose exactly, but asleep and outdoors; Titian finished that canvas and then woke her up.' },
    { label: 'Édouard Manet, Olympia (1863)', note: 'The same pose, the same direct look, a cat instead of a dog, and a scandal.' },
    { label: 'Mark Twain, A Tramp Abroad (1880)', note: 'Devotes pages to calling it obscene, which kept it famous in the English-speaking world.' },
  ],
  summary: 'A young woman lies on crumpled sheets and looks straight out at whoever is standing in front of her. She is entirely naked, entirely awake, and entirely unbothered. Titian painted her in 1534, and the Duke of Urbino bought her, and in the letters about the purchase nobody calls her Venus. They call her the naked woman. The name Venus arrived later, and it is doing a job: there is no shell here, no sea, no cupid, nothing to make this a goddess rather than a person in a bedroom in Venice. What there is instead is domestic detail, and all of it argues. A little dog sleeps at her feet, and a dog means fidelity. Two servants rummage in a bride’s chest in the room behind. Myrtle, the plant of Venus and of marriage, sits on the windowsill. So this may be a wedding picture, painted to instruct a young wife on what was expected of her. Or it may be a portrait of a courtesan, made for a duke who wanted one. Four hundred years of scholarship have not settled it. What is not in doubt is the effect. Mark Twain, who saw it in Florence, called it the foulest and obscenest picture the world possesses, and then wrote about it at length. Manet took the pose, the look, and the servants, swapped the dog for a black cat, and caused the loudest scandal in nineteenth-century French art.',
},
{
  id: 'judith-slaying-holofernes', category: 'old',
  title: 'Judith Slaying Holofernes', artist: 'Artemisia Gentileschi', artistDates: '1593 – c. 1656',
  year: 'c. 1620', sort: 1620, medium: 'Oil on canvas', dims: '199 × 162 cm',
  museum: 'Uffizi Gallery', city: 'Florence',
  file: 'Judit decapitando a Holofernes, por Artemisia Gentileschi.jpg', w: 2056, h: 2500, wiki: 'Judith_Slaying_Holofernes_(Artemisia_Gentileschi,_Florence)',
  history: [
    'Gentileschi painted the subject at least twice. This, the larger and later version, was made in Florence, where she was the first woman admitted to the Accademia delle Arti del Disegno. Cosimo II de’ Medici owned it; a later grand duchess is said to have had it moved to a dark corner because it was unbearable to look at.',
    'In 1611 Gentileschi was raped by the painter Agostino Tassi, her father’s collaborator. The seven-month trial that followed is transcribed and survives; she was tortured with thumbscrews to test her testimony. Reading the picture only as revenge flattens it, but the trial is not nothing, and she painted the subject afterwards.',
  ],
  depicts: [
    'The Assyrian general Holofernes, drunk, wakes as he is being killed. Judith leans in with her sleeves pushed back and both arms braced, one hand forcing his head down by the hair; her maid Abra pins his chest with her whole weight. Blood runs along the sheets and spurts in arcs.',
    'The women are working. Most earlier versions of the scene show Judith stepping back in distaste, or already holding the head; here the difficulty of the act is the subject, and the maid, usually an old woman waiting outside with a sack, is inside the bed helping.',
  ],
  about: [
    'Gentileschi trained in her father Orazio’s studio, worked in Rome, Florence, Venice, Naples and London, ran her own workshop, corresponded with Galileo about an unpaid fee, and took commissions from the Medici and Charles I. She was for centuries a footnote to her father and is now more looked at than he is.',
  ],
  echoes: [
    { label: 'Caravaggio, Judith Beheading Holofernes (c. 1599)', note: 'The model she is answering; his Judith recoils, hers leans in.' },
    { label: 'The Book of Judith', note: 'Deuterocanonical, and the reason a beheading counted as a suitable subject for a palace.' },
    { label: 'Elizabeth Cropper and the 1970s reappraisal', note: 'Feminist art history pulled her out of her father’s catalogue and into her own.' },
  ],
  summary: 'This is a painting about how hard it is to cut off a head. Artemisia Gentileschi was a professional painter by her teens, the first woman admitted to Florence’s academy of drawing, and she painted this story at least twice. In it, the widow Judith has come to the tent of the Assyrian general besieging her city, let him drink himself insensible, and set about killing him. Almost every earlier painter had shown the aftermath, or shown Judith turning her face away in distaste. Gentileschi shows the work. Judith has pushed her sleeves back. Both arms are braced, one hand shoving his head down by the hair, the other driving the sword. Her maid Abra, who in most versions of the scene is an old woman waiting outside with a sack, is here in the bed with her full weight on his chest, because a large man waking up mid-murder will struggle. Blood runs along the sheets and jets in arcs, painted by someone who had looked at how liquid behaves. In 1611, aged seventeen, Gentileschi was raped by a colleague of her father’s. The trial transcript survives, including the thumbscrews applied to her fingers to test whether she was telling the truth. To read the picture only as revenge is to make it smaller than it is. But she painted it afterwards, and a Medici grand duchess later had it moved somewhere it could not be seen.',
},
{
  id: 'the-ambassadors', category: 'old',
  title: 'The Ambassadors', artist: 'Hans Holbein the Younger', artistDates: 'c. 1497 – 1543',
  year: '1533', sort: 1533, medium: 'Oil on oak', dims: '207 × 210 cm',
  museum: 'National Gallery', city: 'London',
  file: 'Hans Holbein the Younger - The Ambassadors - Google Art Project.jpg', w: 30000, h: 29560, wiki: 'The_Ambassadors_(Holbein)',
  tags: ['portrait'],
  history: [
    'Painted in London in the year Henry VIII married Anne Boleyn and broke with Rome. The sitters are Jean de Dinteville, the French ambassador, and his friend Georges de Selve, Bishop of Lavaur. The instruments between them are datable to within days: they read 11 April 1533, Good Friday.',
    'It hung in Dinteville’s château in Burgundy for two centuries, came to England through the art market, and was bought by the National Gallery in 1890. It has never been off display for long since.',
  ],
  depicts: [
    'Two young men in furs stand either side of a two-tiered table loaded with objects: globes celestial and terrestrial, sundials, a quadrant, a torquetum, a lute, a case of flutes, an open hymn book and an open arithmetic book. Behind them hangs a green curtain.',
    'A grey shape floats across the floor at an angle. Step to the right of the picture and look back along its plane and it resolves into a human skull. The lute has a broken string, the arithmetic book is open at a page on division, and the hymn is Luther’s. Everything measurable is in the picture, and a reminder that the measuring stops.',
  ],
  about: [
    'Holbein came from Augsburg, worked in Basel, and moved to England on a letter of introduction from Erasmus to Thomas More. He became painter to Henry VIII and made the images by which we still recognise that court. He died in London, probably of plague, at about forty-five.',
  ],
  echoes: [
    { label: 'Jacques Lacan, The Four Fundamental Concepts (1964)', note: 'The skull is his standing example of the gaze that looks back at you.' },
    { label: 'Memento mori and the vanitas tradition', note: 'This is the form’s most technically ostentatious survival.' },
    { label: 'The anamorphosis in Star Trek and Deadpool title cards', note: 'The trick has never stopped being borrowed.' },
  ],
  summary: 'Two rich young men stand either side of a table, and between them is the entire measurable world. Globes of the earth and the heavens. A sundial, a quadrant, a torquetum, a shepherd’s dial. A lute, a case of flutes, an open hymn book, an open book of arithmetic. Hans Holbein painted them in London in 1533, the year Henry VIII married Anne Boleyn and broke with Rome, and the instruments are set so precisely that they can be read: they say the eleventh of April, 1533, which was Good Friday. The men are Jean de Dinteville, France’s ambassador to England, and his friend Georges de Selve, a bishop at twenty-five. Both are here on business that is going badly. And then there is the thing on the floor. A pale grey smear lies diagonally across the tiles, and it belongs to no perspective the rest of the picture uses. Walk to the right of the canvas, almost to the wall, and look back across its surface, and the smear stands up into a human skull. Everything else in the painting says: look how much we know, how finely we can divide the sky and the hour. The skull says: and yet. Look again and the small things agree with it. The lute has a string snapped. The arithmetic book lies open at a page on division. The hymnal is Luther’s, in a room where that was dangerous.',
},
{
  id: 'durer-self-portrait', category: 'old',
  title: 'Self-Portrait at Twenty-Eight', artist: 'Albrecht Dürer', artistDates: '1471 – 1528',
  year: '1500', sort: 1500, medium: 'Oil on limewood', dims: '67 × 49 cm',
  museum: 'Alte Pinakothek', city: 'Munich',
  file: 'Dürer Alte Pinakothek.jpg', w: 2128, h: 3000, wiki: 'Self-Portrait_(Dürer,_Munich)',
  tags: ['portrait'],
  history: [
    'Painted in Nuremberg at the turn of the century, and inscribed in gold: “I, Albrecht Dürer of Nuremberg, painted myself thus, with undying colours, at the age of twenty-eight.” Dürer kept it. It was still in the family house when the city acquired it in 1805.',
    'It is the third and last of his painted self-portraits and the one that broke with convention entirely. The two before it are three-quarter views in the ordinary manner; this is frontal, symmetrical, and lit like an icon, a format reserved in 1500 for images of Christ.',
  ],
  depicts: [
    'The painter faces directly out, hair falling in arranged ringlets to his shoulders, in a fur-trimmed coat. One hand is raised to the fur at his chest in a gesture that is half adjustment and half blessing. The background is plain dark, with his monogram and the inscription in gold either side of his head.',
    'The claim being made is not that the painter is divine but that he is a maker, in the image of the Maker. It is among the first pictures in which a European artist asserts that painting is an intellectual act rather than a trade.',
  ],
  about: [
    'Dürer was a goldsmith’s son who became the first artist north of the Alps with an international reputation in his own lifetime, largely through printmaking, which he treated as a business and distributed across Europe. He travelled twice to Italy, wrote treatises on measurement and on human proportion, and corresponded with humanists as an equal.',
  ],
  echoes: [
    { label: 'The Vera Icon and Byzantine Christ Pantocrator', note: 'The frontal, symmetrical format he is deliberately borrowing.' },
    { label: 'Rembrandt’s eighty self-portraits', note: 'The genre Dürer effectively opened, pursued for a lifetime.' },
    { label: 'Dürer’s monogram, AD', note: 'One of the first artist’s marks used as a brand, and forged in his lifetime.' },
  ],
  summary: 'In 1500, a painter in Nuremberg looked out of a picture straight at us, and nobody had quite done that before. Albrecht Dürer was twenty-eight. He arranged his hair into ringlets, put on a coat trimmed with fur, and painted himself frontally, symmetrically, lit from the left against a plain dark ground, with one hand raised towards his chest. Every one of those choices was a quotation. That pose, that symmetry, that lighting belonged in 1500 to images of Christ, and to nothing else. Beside his head, in gold, he wrote: I, Albrecht Dürer of Nuremberg, painted myself thus, with undying colours, at the age of twenty-eight. The claim is not that he is divine. The claim is that a painter is a maker, and that making is a kind of thinking — which in 1500, north of the Alps, where painters belonged to guilds alongside saddlers, was an argument that needed making. Dürer made it more successfully than anyone. He was a goldsmith’s son who built an international reputation on printmaking, treated his monogram as a trademark and sued people who copied it, wrote books on proportion and perspective, and dealt with humanists as their equal. He kept this picture. It was still hanging in the family house three centuries after he died.',
},
{
  id: 'burial-of-count-orgaz', category: 'old',
  title: 'The Burial of the Count of Orgaz', artist: 'El Greco', artistDates: '1541 – 1614',
  year: '1586 – 1588', sort: 1587, medium: 'Oil on canvas', dims: '480 × 360 cm',
  museum: 'Church of Santo Tomé', city: 'Toledo',
  file: 'El entierro del señor de Orgaz - El Greco.jpg', w: 6817, h: 9089, wiki: 'The_Burial_of_the_Count_of_Orgaz',
  history: [
    'Commissioned by the parish priest of Santo Tomé for the chapel where the count was buried, to mark a miracle said to have happened there in 1323: Saints Stephen and Augustine were reported to have descended in person to lay the body in the tomb. El Greco had to sue to be paid what the work was worth.',
    'It has never left the wall it was painted for. The church built a separate entrance for it in the nineteenth century because the crowds were interrupting services.',
  ],
  depicts: [
    'The lower half is Toledo in 1586: a row of black-clad gentlemen with white ruffs, each a recognisable citizen, watching two saints in gold vestments lower an armoured corpse into the ground. Above them the picture changes physics entirely — the clouds open, and the soul, carried by an angel, rises through a narrow passage towards Christ, the Virgin and John.',
    'The join is the point. Below, weight, portraiture, and cold daylight; above, elongation, no ground, and light from nowhere. The boy at the lower left pointing into the scene is El Greco’s son Jorge Manuel; the handkerchief in his pocket carries the date of his birth.',
  ],
  about: [
    'Doménikos Theotokópoulos was born in Crete, trained as a painter of icons, worked in Venice under Titian’s shadow and in Rome, and settled in Toledo when Spain would not give him royal commissions. He was learned, litigious, and expensive. For three centuries he was thought eccentric or astigmatic; the twentieth century decided he was modern.',
  ],
  echoes: [
    { label: 'Pablo Picasso, Les Demoiselles d’Avignon (1907)', note: 'Picasso studied El Greco closely; the elongations and the shallow space carry over.' },
    { label: 'Rainer Maria Rilke, letters from Toledo (1912)', note: 'Rilke went to see this painting and wrote about little else for weeks.' },
    { label: 'Jackson Pollock’s student copies', note: 'Pollock drew after El Greco repeatedly in the 1930s.' },
  ],
  summary: 'In the church of Santo Tomé in Toledo there is a wall, and on that wall, where it has hung since 1588, is a painting of a funeral that turns halfway up into something else. The story is local. In 1323 a nobleman known as the Count of Orgaz, a great benefactor of the parish, died, and as he was being buried Saint Stephen and Saint Augustine were said to have come down in person to lower him into the tomb. El Greco was asked to paint the miracle, and what he painted in the lower half is not a miracle at all: it is a row of the men of Toledo, in black with white ruffs, each one a portrait you could pick out of a crowd, standing about at a funeral in the cold. The two saints in gold are doing the heavy lifting. Then, above their heads, the picture abandons every rule it has just obeyed. Cloud opens. Bodies lengthen and lose their weight. An angel carries the soul, which is a small grey shape like a baby, up through a narrow gap towards Christ. There is no ground up there and no single source of light. The two halves are painted by the same hand in the same year and they do not share a physics. For three hundred years people thought El Greco had something wrong with his eyes. Then the twentieth century looked again and decided he had simply arrived early.',
},
{
  id: 'anatomy-lesson', category: 'old',
  title: 'The Anatomy Lesson of Dr Nicolaes Tulp', artist: 'Rembrandt van Rijn', artistDates: '1606 – 1669',
  year: '1632', sort: 1632, medium: 'Oil on canvas', dims: '170 × 217 cm',
  museum: 'Mauritshuis', city: 'The Hague',
  file: 'Rembrandt - The Anatomy Lesson of Dr Nicolaes Tulp.jpg', w: 6000, h: 4520, wiki: 'The_Anatomy_Lesson_of_Dr._Nicolaes_Tulp',
  tags: ['portrait'],
  history: [
    'Rembrandt was twenty-five, newly arrived in Amsterdam, and this was his first large group commission: the Guild of Surgeons paid for a portrait of its annual public dissection. It made his name in the city within a year.',
    'The body is Adriaen Adriaensz, a robber hanged that January; public anatomies were held on executed criminals, in winter, for a paying audience. The open book at the corpse’s feet is Vesalius, and at least one of the listed guild members was added later by another hand.',
  ],
  depicts: [
    'Dr Tulp, hat on, lifts the tendons of the left forearm with forceps while his right hand mimes the motion those tendons produce. Seven colleagues lean in at varying distances, three looking at the arm, three at the book, one straight out at us.',
    'The dissection is wrong on purpose or from a bad source: the arm is opened before the abdomen, which no anatomist would do, and the exposed musculature belongs to a right arm on a left. The demonstration is about the hand as the instrument of the soul, which is why the hand is what he chose.',
  ],
  about: [
    'Rembrandt came from Leiden, the son of a miller, dropped out of university to paint, and by thirty was the most sought-after portraitist in Amsterdam. He overspent, went bankrupt in 1656, and painted his greatest work afterwards in reduced circumstances. He outlived his wife, his partner, and his son.',
  ],
  echoes: [
    { label: 'Andreas Vesalius, De humani corporis fabrica (1543)', note: 'The open book at the foot of the table, and the reason the scene exists.' },
    { label: 'Rembrandt, The Night Watch (1642)', note: 'The same problem — how to make a group portrait move — solved again, ten years on.' },
    { label: 'W. G. Sebald, The Rings of Saturn (1995)', note: 'A long passage on this painting and the anatomy of the criminal body.' },
  ],
  summary: 'Amsterdam, January 1632. A man called Adriaen Adriaensz has been hanged for robbery, and because he was hanged, his body belongs to the Guild of Surgeons, who hold one public dissection a year in winter and sell tickets. Rembrandt van Rijn, twenty-five years old and three months in the city, has been hired to paint it. What he produced made him. Look at what everyone is doing. Dr Tulp, the only man wearing a hat, has opened the left forearm and lifted the tendons out with a pair of forceps. With his other hand, he is miming. He curls his own fingers to show the motion that those tendons produce, and that is the lesson: this is how the hand works, this is the instrument by which a soul acts on the world. His colleagues lean in at different depths. Three are watching the arm. Three are watching the anatomy book propped at the corpse’s feet. One has given up on both and is looking straight out at you. The dissection itself is wrong. Anatomists opened the abdomen first, because it rots first, and the musculature Rembrandt painted belongs to a right arm attached to a left. He was not there to be accurate. He was there to make eight men in black look like they were thinking, which no group portrait in Holland had managed before.',
},
{
  id: 'the-milkmaid', category: 'old',
  title: 'The Milkmaid', artist: 'Johannes Vermeer', artistDates: '1632 – 1675',
  year: 'c. 1658', sort: 1658, medium: 'Oil on canvas', dims: '46 × 41 cm',
  museum: 'Rijksmuseum', city: 'Amsterdam',
  file: 'Johannes Vermeer - Het melkmeisje - Google Art Project.png', w: 9839, h: 11058, wiki: 'The_Milkmaid_(Vermeer)',
  history: [
    'Painted in Delft and recorded in the 1696 sale of the collection of Vermeer’s main patron, where it was described as “exceptionally good”. It has been among the most expensive Dutch pictures at every sale it has passed through since.',
    'The Rijksmuseum bought it in 1908 with state help after a public campaign to stop it leaving the country. Infrared has since shown that Vermeer painted out a large wall map and a basket behind her, emptying the room as he went.',
  ],
  depicts: [
    'A servant stands at a table by a window, pouring milk from an earthenware jug into a bowl. Bread is broken on the table. The wall behind her is bare plaster with a nail and its shadow, a patched hole, and a line of Delft tiles at the foot.',
    'Nothing happens, at some length. The whole picture is arranged around a stream of milk perhaps a centimetre wide, which is the only moving thing in it and the only place the eye can rest. The dotted highlights on the bread are Vermeer’s and nobody else’s.',
  ],
  about: [
    'Vermeer spent his whole life in Delft, ran an inn, dealt in art, converted to Catholicism to marry, had fifteen children of whom eleven survived, and painted perhaps forty-five pictures of which thirty-seven are known. He died in debt at forty-three; his widow said the war had ruined the art trade. He was forgotten for two centuries.',
  ],
  echoes: [
    { label: 'Vermeer, Rijksmuseum (2023)', note: 'The largest Vermeer exhibition ever mounted; tickets sold out before it opened.' },
    { label: 'Salvador Dalí, The Ghost of Vermeer of Delft (1934)', note: 'Dalí called him the greatest painter who ever lived and painted him as a kneeling spectre.' },
    { label: 'Nestlé’s condensed milk trademark', note: 'One of many labels that have borrowed her outright.' },
  ],
  summary: 'A servant pours milk from a jug into a bowl, and that is the whole of it. The painting is small, about the size of a sheet of writing paper, and Johannes Vermeer made it in Delft around 1658, and there is almost nothing in it. Bread on a table. A window with a broken pane. A wall of bare plaster carrying a nail, the shadow of the nail, and a patched hole. Infrared photography has shown what he took out as he worked: a large map hung on that wall, and a laundry basket behind her. He painted them out. He was emptying the room. What is left is a stream of milk perhaps a centimetre across, the only thing moving in the picture, and the only place your eye will agree to settle. Around it Vermeer built the rest: the heavy forearms of someone who works, the yellow bodice and the blue apron, and the bread, whose crust he touched with dots of thick paint that catch the light like nothing else in Dutch painting. She is thinking about pouring. That is all she is thinking about. Vermeer had eleven surviving children and an inn to run and died in debt at forty-three, and the world forgot him for two hundred years. When the Rijksmuseum was in danger of losing this picture abroad in 1908, the Dutch state stepped in and bought it.',
},
{
  id: 'the-swing', category: 'old',
  title: 'The Swing', artist: 'Jean-Honoré Fragonard', artistDates: '1732 – 1806',
  year: '1767', sort: 1767, medium: 'Oil on canvas', dims: '81 × 64 cm',
  museum: 'Wallace Collection', city: 'London',
  file: 'The Swing (P430).jpg', w: 1487, h: 1920, wiki: 'The_Swing_(Fragonard)',
  history: [
    'The commission is recorded by a contemporary: a young nobleman asked a painter to show his mistress on a swing pushed by a bishop, with himself placed where he could see up her skirts. The first painter refused. Fragonard took it, and kept the arrangement, though the pusher became an unwitting husband or servant rather than a cleric.',
    'It passed through the Revolution, was bought by the 4th Marquess of Hertford in the nineteenth century, and came to the nation with the Wallace Collection in 1897, where it may not travel: the bequest forbids loans.',
  ],
  depicts: [
    'A woman in a froth of pink silk swings forward through a dark overgrown garden, kicking off one shoe. In the bushes below and to the left, a young man lies back in the foliage and looks up. An older man in shadow at the right works the ropes. Two stone putti watch, one with a finger to his lips.',
    'The whole picture is arranged on the arc of the swing and the line of the flying shoe. It is the last and lightest statement of a manner that, within twenty-five years, the Revolution would treat as evidence.',
  ],
  about: [
    'Fragonard trained under Chardin and Boucher, won the Prix de Rome, and then abandoned the grand historical career expected of him to paint private pictures for private rooms, fast and brilliantly. The Revolution destroyed his market. He was given a post arranging the new national collections, and died in Paris largely forgotten.',
  ],
  echoes: [
    { label: 'Disney, Frozen (2013)', note: 'Anna’s gallery scene restages it, shoe and all.' },
    { label: 'Nicolas Poussin and Jacques-Louis David', note: 'Everything the Revolution’s painters set out to replace is in this picture.' },
    { label: 'Yinka Shonibare, The Swing (after Fragonard) (2001)', note: 'The figure remade in Dutch wax fabric, headless, at Tate.' },
  ],
  summary: 'A young woman in a great deal of pink silk swings forward out of the shadows of an overgrown garden, and kicks off her shoe. In the bushes below, at exactly the angle you would choose, a young man lies back and looks up. Behind her, half in darkness, an older man works the ropes without any clear idea of what he is helping with. A stone cupid at the left watches, and holds a finger to his lips. A contemporary recorded how the commission came about. A nobleman approached a painter and asked for a picture of his mistress on a swing, pushed by a bishop, arranged so that the patron could be shown looking up her skirts. The first painter, a serious man, declined. Jean-Honoré Fragonard took the job. He dropped the bishop and kept everything else, and he painted it with a speed and lightness that makes the foliage look like weather. This is the high-water mark of the Rococo, the French eighteenth century at its most private, most weightless and most pleased with itself. Twenty-two years later the Revolution arrived, Fragonard’s customers went to the guillotine or into exile, and his kind of painting became evidence of what had been wrong. He ended his life on a state salary, hanging other people’s pictures in the Louvre.',
},
/* ───────────────── NINETEENTH CENTURY, ADDED SEPTEMBER 2026 ───────────────── */
{
  id: 'oath-of-the-horatii', category: 'nineteenth',
  title: 'The Oath of the Horatii', artist: 'Jacques-Louis David', artistDates: '1748 – 1825',
  year: '1784', sort: 1784, medium: 'Oil on canvas', dims: '330 × 425 cm',
  museum: 'Musée du Louvre', city: 'Paris',
  file: 'Le Serment des Horaces - Jacques-Louis David - Musée du Louvre Peintures INV 3692 ; MR 1432.jpg', w: 10051, h: 7794, wiki: 'Oath_of_the_Horatii',
  history: [
    'Commissioned by the crown and painted in Rome, where David rented a studio and worked on it for a year, enlarging the canvas twice. He showed it in Rome first, to crowds, before sending it to the Paris Salon of 1785, where it was hung late and badly and became the sensation of the year anyway.',
    'Five years before the Revolution, a picture about swearing to die for the state was read as republican prophecy. David himself went on to vote for the king’s execution, run the visual propaganda of the Revolution, and end his life in exile in Brussels.',
  ],
  depicts: [
    'Three brothers stretch their arms towards their father, who holds up three swords. They have agreed to fight three brothers of a rival city to settle a war. At the right, the women of the household collapse into each other, already grieving: one of the sisters is engaged to one of the enemy.',
    'The picture is built on the contrast between the straight lines of the men and the curves of the women, under three severe arches that assign each group its space. The light is stage light. Nothing is soft, and nothing is accidental.',
  ],
  about: [
    'David trained in the rococo manner, failed the Prix de Rome three times, attempted suicide by starvation, won it at the fourth attempt, and returned from Italy with a style stripped to the bone. He became the Revolution’s pageant-master, was imprisoned after Robespierre fell, and re-emerged as Napoleon’s painter.',
  ],
  echoes: [
    { label: 'Livy and Corneille’s Horace (1640)', note: 'The Roman historian gives the story; the play gave David his staging.' },
    { label: 'David, The Death of Marat (1793)', note: 'The same severity turned on an event he had witnessed himself.' },
    { label: 'The Raised-Arm Salute', note: 'This gesture, invented here, was later read back into Rome and appropriated in the twentieth century.' },
  ],
  summary: 'Three young men reach out for three swords, and every line in the painting agrees with them. Jacques-Louis David painted this in Rome in 1784 and sent it to Paris, and it arrived like a door slamming. The story is from Livy. Two cities at war agree to settle the matter by combat between three brothers from each side. The Horatii are the Roman three, and here they are swearing to their father that they will come back victorious or not at all. Look at how the picture is made. Everything about the men is straight: the arms, the legs, the swords, the tension. Everything about the women on the right is curved and collapsed, because they already know what the men have not yet worked out. One of the sisters is engaged to one of the enemy brothers, and whatever happens today she loses. Three arches divide the canvas and give each group its allotted space, and the light falls like stage light on an empty floor. There is no decoration anywhere. This was the point. French painting at that moment was pink and soft and private, and David had come back from Italy with something hard. Five years later the Revolution began. David voted for the king’s death, designed its festivals and its martyrs, went to prison when Robespierre fell, and came out to paint Napoleon.',
},
{
  id: 'saturn-devouring-his-son', category: 'nineteenth',
  title: 'Saturn Devouring His Son', artist: 'Francisco Goya', artistDates: '1746 – 1828',
  year: '1819 – 1823', sort: 1821, medium: 'Mixed media mural transferred to canvas', dims: '144 × 81 cm',
  museum: 'Museo del Prado', city: 'Madrid',
  file: 'Francisco de Goya, Saturno devorando a su hijo (1819-1823).jpg', w: 1661, h: 3051, wiki: 'Saturn_Devouring_His_Son',
  tags: ['myth'],
  history: [
    'Painted directly onto the plaster of a wall in the Quinta del Sordo, the house outside Madrid where Goya lived alone, deaf, after a near-fatal illness. There are fourteen of these Black Paintings. He did not title them, did not exhibit them, and never mentioned them in writing.',
    'They were transferred to canvas in the 1870s, a brutal operation that lost paint and changed them, and given to the Prado. This one had a section at the lower right removed in the transfer, which some scholars believe altered what the figure was doing.',
  ],
  depicts: [
    'An enormous figure, eyes wide and white, crouches out of blackness with a headless body gripped in both fists, biting into the left arm. One arm has already been eaten to the shoulder. There is no setting, no floor, and no light source.',
    'Saturn ate his children to prevent the prophecy that one would overthrow him. Goya’s version has none of the classical composure of earlier treatments; the god looks terrified rather than cruel, which is a reading of the myth almost nobody had offered before.',
  ],
  about: [
    'Goya rose to be First Court Painter to the Spanish crown, went deaf at forty-six after an illness that nearly killed him, and lived through the Peninsular War and its reprisals. His late work turns away from the court entirely. He left Spain for Bordeaux in 1824 and died there at eighty-two.',
  ],
  echoes: [
    { label: 'Peter Paul Rubens, Saturn (1636)', note: 'Hanging in the same city; Goya certainly knew it, and refused everything about it.' },
    { label: 'Goya, The Disasters of War (1810 – 20)', note: 'The prints made in the same years, and the same argument by other means.' },
    { label: 'Ridley Scott, Hannibal (2001)', note: 'One of many films to put the painting on the wall behind the monster.' },
  ],
  summary: 'This was painted on a wall, in a house, by a man who had gone deaf and did not intend anyone to see it. Around 1819, Francisco Goya bought a farmhouse outside Madrid called the Quinta del Sordo, the House of the Deaf Man, and over four years he covered its walls in fourteen paintings of a kind nobody had made before. He gave them no titles. He never exhibited them, never sold them, and never mentioned them in a letter. We call them the Black Paintings, and this is the one people remember. The myth is standard: Saturn, warned that a son would overthrow him, ate his children as they were born. Rubens had painted it, and so had others, and in their versions the god is a classical figure performing a cruelty. Goya’s Saturn is not cruel. Look at the eyes. He is terrified. He is an enormous, filthy, crouching thing emerging from a blackness that has no floor and no walls, and he is eating a body that is already missing its head and one arm, and his expression is the expression of somebody who cannot stop. The paintings were cut off the walls in the 1870s and glued to canvas, which damaged them and may have changed this one at the lower edge. Goya had, by then, been dead for fifty years.',
},
{
  id: 'grande-odalisque', category: 'nineteenth',
  title: 'La Grande Odalisque', artist: 'Jean-Auguste-Dominique Ingres', artistDates: '1780 – 1867',
  year: '1814', sort: 1814, medium: 'Oil on canvas', dims: '91 × 162 cm',
  museum: 'Musée du Louvre', city: 'Paris',
  file: 'La grande odalisque - Jean-Auguste Dominique Ingres - Musée du Louvre Peintures RF 1158.jpg', w: 9311, h: 5196, wiki: 'Grande_Odalisque',
  history: [
    'Commissioned by Caroline Murat, Napoleon’s sister and Queen of Naples, and never paid for: the Napoleonic order collapsed before the bill was settled. Ingres was in Rome and remained there for years afterwards.',
    'Shown in Paris in 1819, it was attacked for its anatomy. One critic complained the figure had three vertebrae too many. He was not far wrong: analysis in the 1970s put the excess at about five, along with an arm and a pelvis that do not connect to anything.',
  ],
  depicts: [
    'A reclining woman looks back over her shoulder at the viewer, holding a peacock-feather fan. The setting is an imagined Ottoman interior — a hookah, a turban of silk, heavy blue drapery — of a kind Ingres had never seen.',
    'The back is impossibly long, the right arm is shorter than the left, the left leg emerges from nowhere. Ingres was not a careless draughtsman; he was among the most exacting in Europe. The distortions are deliberate, and they are why the pose flows the way it does.',
  ],
  about: [
    'Ingres wanted to be remembered as a painter of history and was continually praised for portraits he considered a distraction. He led the line-drawing party against Delacroix’s colour for decades, ran a hugely influential studio, and played the violin well enough that the French phrase for a serious hobby is still “violon d’Ingres”.',
  ],
  echoes: [
    { label: 'Titian, Venus of Urbino (1534)', note: 'The reclining nude tradition Ingres is joining, and orientalising.' },
    { label: 'Guerrilla Girls, Do women have to be naked to get into the Met? (1989)', note: 'The poster puts a gorilla mask on this figure; it is the group’s best-known work.' },
    { label: 'Man Ray, Le Violon d’Ingres (1924)', note: 'A photographed back with f-holes painted on, punning on Ingres’s violin.' },
  ],
  summary: 'She has too many vertebrae. When this was shown in Paris in 1819, a critic complained that the figure had three more than a human being, and when anatomists looked properly in the twentieth century they found it was closer to five, plus a right arm shorter than the left and a left leg that does not attach to anything. Jean-Auguste-Dominique Ingres was not a sloppy draughtsman. He was arguably the finest in Europe, a man who spent his life arguing that line was everything and colour a distraction, and he lengthened that back on purpose, because a correct spine would not have made that curve. The picture was ordered by Napoleon’s sister, the Queen of Naples, and never paid for, because the empire fell over before the invoice did. The setting is an Ottoman harem, a place Ingres had never been and never would go: the hookah, the turban, the peacock fan and the heavy blue curtain are all assembled from prints and hearsay, which is what makes it an orientalist fantasy rather than a record of anything. What survives all of this is the look. She has turned her head back over her shoulder to find you standing there, and her expression gives away nothing at all. In 1989 the Guerrilla Girls put a gorilla mask on that head and asked whether women had to be naked to get into the Met.',
},
{
  id: 'the-hay-wain', category: 'nineteenth',
  title: 'The Hay Wain', artist: 'John Constable', artistDates: '1776 – 1837',
  year: '1821', sort: 1821, medium: 'Oil on canvas', dims: '130 × 185 cm',
  museum: 'National Gallery', city: 'London',
  file: 'John Constable - The Hay Wain (1821).jpg', w: 6128, h: 4226, wiki: 'The_Hay_Wain',
  tags: ['landscape'],
  history: [
    'Shown at the Royal Academy in 1821 under the title Landscape: Noon, and did not sell. Three years later it was exhibited in Paris, won a gold medal from Charles X, and reportedly sent Delacroix back to repaint the background of his own Salon entry.',
    'It came to the National Gallery in 1886 and has been voted the nation’s favourite painting more than once. In 2013 two protesters glued a photograph over it; the varnish took the damage and the picture did not.',
  ],
  depicts: [
    'A wagon stands in the shallow water of the River Stour with two horses and two men aboard. Willy Lott’s cottage sits at the left, a dog watches from the bank, and beyond the trees a meadow opens where haymakers are working in the sun. Most of the canvas is sky.',
    'The subject is weather. Constable painted hundreds of cloud studies on Hampstead Heath, dated and annotated with wind direction, and the sky here is doing something specific rather than being a backdrop. The flecks of white on the water were mocked at the time as Constable’s snow.',
  ],
  about: [
    'Constable was a Suffolk miller’s son who painted the same few square miles of the Stour valley all his life and sold barely twenty pictures in England. He was elected to the Royal Academy at fifty-two, late and grudgingly, the year after his wife died. He said he had never seen an ugly thing in his life.',
  ],
  echoes: [
    { label: 'Eugène Delacroix and the Salon of 1824', note: 'Delacroix saw it in Paris and is said to have gone home and reworked his own picture.' },
    { label: 'Peter Kennard, Haywain with Cruise Missiles (1980)', note: 'Missiles photomontaged onto the cart; a defining image of British protest art.' },
    { label: 'Willy Lott’s cottage, Flatford', note: 'Still standing, and still photographed from the exact spot.' },
  ],
  summary: 'A cart has stopped in a river. Two men are on it, two horses are in the water, a dog is watching from the bank, and the day is going nowhere in particular. John Constable called it Landscape: Noon when he showed it in London in 1821, and nobody bought it. He was a miller’s son from Suffolk who painted the same few square miles of the Stour valley for his entire life, and England was not much interested. Then in 1824 it was sent to Paris, won a gold medal from the king, and — the story goes — sent Delacroix home to repaint the background of his own Salon picture. The real subject is the sky, which takes up more than half the canvas. Constable spent years on Hampstead Heath painting clouds, dating each study and noting the wind direction on the back, and the weather here is a particular weather on a particular afternoon rather than scenery. The white flecks he scattered on the water and foliage to catch the light were ridiculed at the time as Constable’s snow. Everything else is ordinary on purpose: a cottage belonging to a farmer called Willy Lott, who is said to have spent all but four days of his eighty-odd years in it. The building is still there. So is the spot you would stand in to take the photograph.',
},
{
  id: 'ophelia', category: 'nineteenth',
  title: 'Ophelia', artist: 'John Everett Millais', artistDates: '1829 – 1896',
  year: '1851 – 1852', sort: 1852, medium: 'Oil on canvas', dims: '76 × 112 cm',
  museum: 'Tate Britain', city: 'London',
  file: 'John Everett Millais - Ophelia - Google Art Project.jpg', w: 7087, h: 4820, wiki: 'Ophelia_(painting)',
  history: [
    'Painted in two stages over eleven months: the river first, outdoors on the Hogsmill in Surrey, eleven hours a day for five months, and the figure afterwards in a London studio.',
    'Elizabeth Siddal posed in a full bath kept warm by oil lamps beneath it. The lamps went out, Millais painted on without noticing, and she caught a severe cold; her father sent him a bill for the doctor. She later married Rossetti and died of laudanum at thirty-two.',
  ],
  depicts: [
    'Ophelia floats on her back in a stream, palms open, singing as she goes under, surrounded by the flowers Shakespeare names and several he does not. The bank is a dense tangle of willow, nettle, meadowsweet and forget-me-not, painted leaf by leaf.',
    'The flowers are a second text: poppy for death, pansy for thought, violet for faithfulness, daisy for innocence, and a robin in the willow that answers a line in her song. The botany is accurate enough to identify species, and some of it does not flower at the same time of year.',
  ],
  about: [
    'Millais was the youngest student ever admitted to the Royal Academy schools, founded the Pre-Raphaelite Brotherhood at nineteen with Rossetti and Hunt, and was savaged by Dickens for his early work. He later married John Ruskin’s former wife, became enormously successful and popular, and died President of the Academy.',
  ],
  echoes: [
    { label: 'Shakespeare, Hamlet, Act IV Scene vii', note: 'Gertrude’s speech describing the drowning, which is all the play gives.' },
    { label: 'Lars von Trier, Melancholia (2011)', note: 'Kirsten Dunst floating with her bouquet is this painting shot for shot.' },
    { label: 'Nick Cave, Where the Wild Roses Grow (1995)', note: 'The video restages it; so have a long line of album sleeves and fashion shoots.' },
  ],
  summary: 'She is still singing. In Hamlet, Ophelia’s drowning happens offstage and is reported by the queen in a speech of about fifteen lines, and John Everett Millais took those lines and spent eleven months on them. He painted the river first, sitting on the bank of the Hogsmill in Surrey for eleven hours a day, five months, through a summer and into winter, complaining in letters about flies, wind and a farmer who threatened him for trespass. Every plant is identifiable. Willow, nettle, meadowsweet, forget-me-not, poppy, pansy, violet, daisy — and each was chosen for what it means, so the bank is a second version of the same story told in flowers. Some of them do not bloom in the same month. The figure came afterwards, in a studio in London, where Elizabeth Siddal lay in a full bath warmed by oil lamps underneath it. One day the lamps went out. Millais was absorbed and did not notice, Siddal said nothing and stayed in the cooling water, and she became seriously ill; her father sent the painter the doctor’s bill. She married Rossetti, struggled with laudanum, and died at thirty-two. The painting has since become the template for every drowned woman in art, film and photography, which is a strange fate for fifteen lines of reported speech.',
},
{
  id: 'burial-at-ornans', category: 'nineteenth',
  title: 'A Burial at Ornans', artist: 'Gustave Courbet', artistDates: '1819 – 1877',
  year: '1849 – 1850', sort: 1850, medium: 'Oil on canvas', dims: '315 × 668 cm',
  museum: 'Musée d’Orsay', city: 'Paris',
  file: 'Gustave Courbet - A Burial at Ornans - Google Art Project 2.jpg', w: 6042, h: 2777, wiki: 'A_Burial_At_Ornans',
  history: [
    'Painted in Courbet’s home town in the Franche-Comté, using the townspeople as models — the mayor, the priest, the gravediggers, his own sisters — each one posing in his studio in turn. It is over six and a half metres wide.',
    'Shown at the Salon of 1850–51 and detested. The objection was scale: a canvas that size was for battles, coronations and scripture, and Courbet had used it on a village funeral with no hero, no saint and nothing uplifting. He said he had buried Romanticism in it.',
  ],
  depicts: [
    'A crowd of some fifty life-size figures stands along a shallow trench at the edge of a provincial cemetery: clergy in red, pallbearers, beadles with bulbous noses, a mayor, weeping women, a dog looking away, and a hole in the ground at the front with a skull beside it.',
    'Nobody is arranged. The line of figures runs flat across the canvas with no focal point, so there is nothing to look at first and nothing to look at last. The identity of the dead man is not given. The dog is the only thing in the picture that seems certain about anything.',
  ],
  about: [
    'Courbet was a self-taught farmer’s son with an enormous appetite for controversy, who declared that painting could only consist of the representation of real and existing things. He took part in the Paris Commune, was held responsible for toppling the Vendôme Column, was billed for its re-erection, and died in Swiss exile the day before the first instalment fell due.',
  ],
  echoes: [
    { label: 'Rembrandt, The Night Watch (1642)', note: 'The Dutch group portrait, which Courbet had studied, at Salon scale.' },
    { label: 'Édouard Manet and the Salon of 1863', note: 'The generation that took from Courbet the idea that ordinary life would do.' },
    { label: 'The Paris Commune, 1871', note: 'Courbet’s politics and his painting were read as the same act, and punished together.' },
  ],
  summary: 'It is twenty-two feet wide, and it is a funeral in a village nobody had heard of. That was the offence. In 1850, a canvas of this size in France meant a coronation, a battle, a scene from scripture — something with a hero in it. Gustave Courbet filled one with the burial of an unnamed man in Ornans, the small town in the Franche-Comté where he had grown up, and he painted the mourners life-size. They are real people. He brought the townspeople into his studio one after another: the mayor, the priest, the gravediggers, the beadles with their red robes and their drinkers’ noses, his own sisters among the women. And he arranged them in no particular order, in a flat line across the canvas, with no centre, so the eye has nowhere to go first. At the front there is a hole in the ground and a skull beside it. Off to one side, a dog has lost interest and is looking out of the frame. Critics called it ugly, and they were reacting correctly: the picture is a refusal. Courbet said afterwards that the burial at Ornans was in reality the burial of Romanticism. He later joined the Paris Commune, was blamed for the destruction of the Vendôme Column, and died in exile in Switzerland the day before the first payment towards rebuilding it was due.',
},
{
  id: 'the-gleaners', category: 'nineteenth',
  title: 'The Gleaners', artist: 'Jean-François Millet', artistDates: '1814 – 1875',
  year: '1857', sort: 1857, medium: 'Oil on canvas', dims: '84 × 112 cm',
  museum: 'Musée d’Orsay', city: 'Paris',
  file: 'Jean-François Millet - Gleaners - Google Art Project 2.jpg', w: 5354, h: 4006, wiki: 'The_Gleaners',
  history: [
    'Shown at the Salon of 1857 and disliked by the press of a country nine years after a revolution. To paint the rural poor at this scale, with this gravity, was read as a political statement; one critic saw in the three bent figures “the scaffolds of 1793”.',
    'It sold for a modest sum in Millet’s lifetime. In 1889 it went for three hundred thousand francs, and it entered the Louvre by bequest a year later. Millet died in 1875, having spent most of his life short of money.',
  ],
  depicts: [
    'Three women bend over a harvested field, picking up the ears of corn left behind. Behind them, in bright light, is the harvest proper: stacks, a cart, a mounted overseer, a farm’s worth of plenty.',
    'Gleaning was a right of the very poorest, allowed after the harvest was taken. The distance between the three foreground figures and the abundance behind them is the entire argument of the painting, and it is made by composition alone, without a word of commentary.',
  ],
  about: [
    'Millet was born to a farming family in Normandy and knew the work he painted. He settled in Barbizon on the edge of the Fontainebleau forest and painted peasants for the rest of his life, insisting he was a painter rather than a socialist. Van Gogh copied him repeatedly and called him the voice of the wheat.',
  ],
  echoes: [
    { label: 'Vincent van Gogh’s copies after Millet (1880 – 90)', note: 'Van Gogh returned to Millet throughout his life, calling him father Millet.' },
    { label: 'The Book of Ruth', note: 'Gleaning as a biblical right, which is how the subject entered European painting.' },
    { label: 'Agnès Varda, The Gleaners and I (2000)', note: 'A documentary that begins at this painting and follows modern gleaners to the end.' },
  ],
  summary: 'Three women are bent over in a field, picking up what the harvest missed. That is the whole subject, and in 1857 it caused a great deal of trouble. Gleaning was the old right of the poorest people in a village to go over a field after the crop was taken and keep whatever was left — a handful of ears, enough for bread. Jean-François Millet painted three women doing it at a scale that French painting reserved for serious matters, and he gave them the weight and dignity of figures on a monument. The country had had a revolution nine years earlier and was in no mood. One critic said he saw in the three bent backs the scaffolds of 1793. What makes the picture work is what is behind them. In the bright distance is the harvest itself: the stacks, the loaded cart, the crowd of workers, the overseer on his horse. There is plenty in this field. It is simply not for them. Millet makes that argument without a single gesture of protest — nobody is looking up, nobody is complaining, the women are just working. He grew up on a farm in Normandy and always denied he was making political pictures. He sold this one for very little. Thirty years later it changed hands for three hundred thousand francs.',
},
{
  id: 'the-ballet-class', category: 'nineteenth',
  title: 'The Ballet Class', artist: 'Edgar Degas', artistDates: '1834 – 1917',
  year: '1873 – 1876', sort: 1875, medium: 'Oil on canvas', dims: '85 × 75 cm',
  museum: 'Musée d’Orsay', city: 'Paris',
  file: 'Edgar Degas - La Classe de danse.jpg', w: 4618, h: 5300, wiki: 'The_Dance_Class',
  history: [
    'Begun for the singer Jean-Baptiste Faure, who had to wait years for it; Degas reworked the canvas repeatedly and changed the ballet master’s identity partway through. The old man with the stick is Jules Perrot, a famous dancer of the previous generation, painted from a separate study.',
    'Degas made around fifteen hundred works on dancers over forty years, which is roughly half his output. He was not a balletomane in the usual sense; he had a subscription that let him behind the scenes and used it to watch people working.',
  ],
  depicts: [
    'A rehearsal room at the Paris Opéra. An examination is going on: one girl dances at the centre while the master leans on his stick and the rest wait, and almost none of them are looking at her. A mother reads a newspaper. A dancer scratches her back; another adjusts an earring; one sits on the piano.',
    'The floor tilts steeply up, the space is cropped at the edges like a photograph, and the arrangement pushes everything to the sides and leaves the centre almost empty. The interest is in the waiting, not the dancing.',
  ],
  about: [
    'Degas was a banker’s son, trained in the classical tradition, and disliked being called an Impressionist — he wanted to be called a realist and painted almost entirely indoors, from drawings and memory. His eyesight failed progressively from his forties, pushing him towards pastel and sculpture. He died nearly blind at eighty-three.',
  ],
  echoes: [
    { label: 'Degas, The Little Fourteen-Year-Old Dancer (1881)', note: 'The wax sculpture in a real tutu that horrified the 1881 exhibition.' },
    { label: 'Japanese woodblock prints', note: 'The steep floor, the cropping and the empty centre come from prints then flooding Paris.' },
    { label: 'Photography and the snapshot', note: 'Degas owned a camera and composed as if a shutter had caught the room mid-moment.' },
  ],
  summary: 'An examination is in progress at the Paris Opéra, and almost nobody is watching it. A girl dances in the middle of the floor. The old man leaning on the long stick is Jules Perrot, a great dancer of an earlier generation, now teaching. And around them, the room carries on: a mother sits reading a newspaper, a dancer scratches her back, another fiddles with an earring, one has perched on the piano, several are talking. Edgar Degas made about fifteen hundred pictures of dancers, roughly half of everything he produced, and this is what he was after. Not the performance — he painted very few performances — but the hours of standing about that surround it. He had a subscription that got him backstage and he used it the way a naturalist uses a hide. The composition is doing something unusual. The floorboards rush up and away, the figures are pushed out to the edges, the centre is nearly empty, and people are cut off by the frame as though the picture had been taken rather than arranged. That comes from two things arriving in Paris at once: Japanese woodblock prints, which he collected, and the camera, which he owned. Degas hated being called an Impressionist. He said he was a realist, and he meant that he painted what people actually do when they think the performance has not started.',
},
{
  id: 'whistlers-mother', category: 'nineteenth',
  title: 'Arrangement in Grey and Black No. 1', artist: 'James McNeill Whistler', artistDates: '1834 – 1903',
  year: '1871', sort: 1871, medium: 'Oil on canvas', dims: '144 × 162 cm',
  museum: 'Musée d’Orsay', city: 'Paris',
  file: 'Whistlers Mother high res.jpg', w: 5897, h: 5247, wiki: 'Whistler\'s_Mother',
  tags: ['portrait'],
  history: [
    'The title everyone uses is not the title. Whistler called it an arrangement of grey and black, and said the identity of the sitter could not possibly matter to the public. The sitter was Anna McNeill Whistler, his mother, who was living with him in Chelsea.',
    'The Royal Academy nearly rejected it in 1872 and hung it grudgingly. France bought it in 1891, the first Whistler in a public collection anywhere. It toured America during the Depression to enormous crowds and became, improbably, an American icon of motherhood.',
  ],
  depicts: [
    'An elderly woman in a black dress and white lace cap sits in profile on a hard chair, hands folded, feet on a low stool, looking at a wall. A patterned curtain hangs at the left; one framed print hangs behind her; the rest is grey.',
    'Almost nothing is described. There is no anecdote, no expression to read, no interior to furnish the character. The picture is composed like an abstract arrangement of rectangles and one curve, which is precisely what the title says it is.',
  ],
  about: [
    'Whistler was born in Massachusetts, expelled from West Point, and spent his career in London and Paris being spectacular. He sued Ruskin for libel over a review, won a farthing in damages, and was bankrupted by the costs. He insisted on art for art’s sake and gave his pictures musical titles — nocturnes, symphonies, arrangements — to stop people reading stories into them.',
  ],
  echoes: [
    { label: 'Mr. Bean (1997)', note: 'The plot of the film is the destruction of this painting.' },
    { label: 'The 1934 US postage stamp', note: 'Issued “in memory and in honor of the mothers of America”, which Whistler would have hated.' },
    { label: 'Whistler v. Ruskin (1878)', note: 'The libel trial that made art for art’s sake a matter of public record.' },
  ],
  summary: 'James McNeill Whistler did not call this Whistler’s Mother. He called it Arrangement in Grey and Black No. 1, and when people asked about the sitter he said that the identity of the woman could not possibly interest the public. The sitter was his mother, Anna, who was living with him in Chelsea at the time, and the story is that a model failed to turn up and she stood in, and then could not stand for long, so a chair was brought. Look at what is actually in the picture. A woman in profile in a black dress. A white cap. A hard chair, a footstool, a patterned curtain, one framed print, and a very large amount of grey wall. There is no expression to read, no object to explain her, no story. It is a composition of rectangles with one soft curve in it, and Whistler meant exactly that: he gave his paintings musical names — nocturnes, symphonies, arrangements — specifically to stop people looking for anecdotes. The Royal Academy almost rejected it. France bought it in 1891, the first Whistler to enter a public collection. Then it toured America during the Depression, crowds queued round blocks to see it, the Post Office put it on a stamp honouring the mothers of America, and a picture built to be about nothing became the most sentimental image in the country.',
},
{
  id: 'olympia', category: 'nineteenth',
  title: 'Olympia', artist: 'Édouard Manet', artistDates: '1832 – 1883',
  year: '1863', sort: 1863, medium: 'Oil on canvas', dims: '130 × 190 cm',
  museum: 'Musée d’Orsay', city: 'Paris',
  file: 'Edouard Manet - Olympia - Google Art ProjectFXD.jpg', w: 5876, h: 3976, wiki: 'Olympia_(Manet)',
  history: [
    'Painted in 1863 and held back for two years; when it was shown at the Salon of 1865 it had to be rehung high in a corner and guarded, because visitors were trying to attack it with sticks and umbrellas.',
    'Manet died in 1883 with the picture unsold. Claude Monet organised a public subscription to buy it from his widow and give it to the state, which accepted it reluctantly and hung it in the Musée du Luxembourg in 1890.',
  ],
  depicts: [
    'A naked woman lies on white sheets, propped on pillows, a ribbon at her throat, one mule dangling from her foot, one hand flat across her thigh. A servant brings a large bouquet, still wrapped. A black cat stands at the end of the bed with its back up.',
    'The model is Victorine Meurent, a painter herself. The name Olympia, the orchid in the hair, the ribbon and the bracelet all signalled a courtesan to a Paris audience, and so did the flowers arriving from someone off-stage. What caused the riot was not the nakedness but the look: unashamed, unhurried, and directed at the person in front of the canvas.',
  ],
  about: [
    'Manet came from a wealthy legal family, wanted official success all his life, and never got it. He refused to exhibit with the Impressionists although he was their central example, and painted modern Paris — bars, boats, streets, and people who worked — with the technique of the Old Masters he had copied in the Louvre.',
  ],
  echoes: [
    { label: 'Titian, Venus of Urbino (1534)', note: 'The direct source: same pose, same room, dog replaced by a cat.' },
    { label: 'Émile Zola’s defence (1867)', note: 'Zola wrote a pamphlet defending it and Manet painted his portrait with it on the wall.' },
    { label: 'Larry Rivers, I Like Olympia in Black Face (1970)', note: 'One of many works reopening the question of the servant, long the unlooked-at figure.' },
  ],
  summary: 'In 1865 the Paris Salon had to hang a painting out of reach and put a guard in front of it, because people were coming at it with their umbrellas. The painting was Olympia. It is, in its bones, a copy. Titian’s Venus of Urbino has a naked woman on white sheets propped on pillows, a servant in the background and a small dog at her feet, and Édouard Manet used every part of that arrangement. He changed three things. He replaced the sleeping dog with a black cat, arched and awake. He gave the servant a bouquet, still in its paper, sent by somebody we do not see. And he painted the woman as a particular person — Victorine Meurent, a model who was also a painter — with a ribbon at her throat, an orchid in her hair, one slipper half off, and a hand laid flat and deliberately across her thigh. Every one of those details told a Paris audience that she was a courtesan. But the nudes of the Salon were courtesans too, dressed up as goddesses. What could not be forgiven was that she is looking at you, without shame and without interest, as at a client who has arrived. Manet died with it unsold. Monet raised a public subscription to buy it for France.',
},
/* ───────────────────── MODERN, ADDED SEPTEMBER 2026 ───────────────────── */
{
  id: 'sunflowers', category: 'modern',
  title: 'Sunflowers', artist: 'Vincent van Gogh', artistDates: '1853 – 1890',
  year: '1888', sort: 1888, medium: 'Oil on canvas', dims: '92 × 73 cm',
  museum: 'National Gallery', city: 'London',
  file: 'Vincent Willem van Gogh 127.jpg', w: 3349, h: 4226, wiki: 'Sunflowers_(Van_Gogh_series)',
  history: [
    'Painted in Arles in August 1888 in a week of hard sun, to decorate the bedroom Van Gogh was preparing for Paul Gauguin in the Yellow House. He wrote to his brother Theo that he was working from the morning light with the intention of doing a dozen panels of nothing but sunflowers.',
    'There are five in the series, with a sixth lost in Japan during the war, plus repetitions Van Gogh made the following January. The chrome yellows he used are chemically unstable, and conservators have shown that some of the brightest passages are browning permanently.',
  ],
  depicts: [
    'Fifteen sunflowers in an earthenware pot on a table, at every stage from full bloom to spent seed head, against a yellow wall, in a yellow vase, with a yellow signature.',
    'The picture is almost entirely one colour, which was the experiment: Van Gogh set out to prove that yellow on yellow could still carry form. The flowers going over are not accidental — the series is a life cycle, not a bouquet.',
  ],
  about: [
    'Van Gogh came late to painting, worked for ten years, and sold almost nothing. He was supported throughout by his brother Theo, to whom he wrote more than six hundred letters that are among the best accounts of making art in existence. He shot himself in a wheatfield at thirty-seven.',
  ],
  echoes: [
    { label: 'Paul Gauguin, The Painter of Sunflowers (1888)', note: 'Gauguin painted Van Gogh at work on them, and Van Gogh disliked the result.' },
    { label: 'Don McLean, Vincent (1971)', note: 'Starry starry night; the song that fixed the popular image of him.' },
    { label: 'Japanese corporate collecting in the 1980s', note: 'A version sold in 1987 for a then-record price and set off a decade of speculation.' },
  ],
  summary: 'Vincent van Gogh painted these in Arles in August 1888, in a hurry, because Paul Gauguin was coming to stay. He had rented a yellow house and was preparing a room, and he decided to hang it with sunflowers, working through the mornings while the light held and writing to his brother Theo that he meant to do a dozen panels of nothing else. What he was really doing was an experiment. The wall is yellow, the table is yellow, the vase is yellow and so are the flowers, and the signature is painted in yellow on yellow. The question was whether a picture could be made almost entirely out of one colour and still contain things that stand up and occupy space. Look at how he did it: by thickening the paint until the petals are physically raised off the canvas, so that form is carried by relief rather than by shadow. And look at the flowers themselves. They are not a bouquet. Some are in full bloom, some are half open, and several have gone over completely into ragged seed heads. This is a life cycle in a pot. There is a cruel footnote. The chrome yellow he used was new and unstable, and modern analysis shows the brightest passages are slowly turning brown. The picture is fading in a way he could not have known.',
},
{
  id: 'where-do-we-come-from', category: 'modern',
  title: 'Where Do We Come From? What Are We? Where Are We Going?', artist: 'Paul Gauguin', artistDates: '1848 – 1903',
  year: '1897 – 1898', sort: 1898, medium: 'Oil on canvas', dims: '139 × 375 cm',
  museum: 'Museum of Fine Arts', city: 'Boston',
  file: 'Gauguin - Where Do We Come From? What Are We? Where Are We Going? (1897-98).jpg', w: 5400, h: 1987, wiki: 'Where_Do_We_Come_From%3F_What_Are_We%3F_Where_Are_We_Going%3F',
  history: [
    'Painted in Tahiti in about a month, on sacking, after Gauguin learned of the death of his favourite daughter Aline and while he was ill and deeply in debt. He wrote that he intended to kill himself when it was finished, went into the hills with arsenic, took too much, and was sick.',
    'He told his dealer to read it from right to left, and inscribed the three questions in the top left corner himself. It went to Boston in 1936 and has rarely left the building since.',
  ],
  depicts: [
    'A frieze more than three and a half metres long. At the right, a sleeping infant and three seated women. At the centre, a figure reaching up to pick fruit. At the left, an old woman crouched with her head in her hands beside a white bird holding a lizard, and a blue idol with both arms raised.',
    'The order is the answer: birth at one end, death at the other, and the ordinary business of living in between. The blue figure is Gauguin’s invention rather than any Polynesian deity, which is true of most of the religion in his Tahitian pictures.',
  ],
  about: [
    'Gauguin was a Paris stockbroker who gave it up at thirty-five to paint, left his wife and five children, and spent his last decade in Tahiti and the Marquesas pursuing an idea of the primitive that the islands, already colonised and missionised, could not supply. He took teenage girls as partners, fought the colonial administration, and died in poverty in 1903.',
  ],
  echoes: [
    { label: 'Gauguin’s letters to Daniel de Monfreid (1898)', note: 'Where he sets out the reading order and describes the suicide attempt.' },
    { label: 'W. Somerset Maugham, The Moon and Sixpence (1919)', note: 'The novel that turned his biography into the myth of the artist who abandons everything.' },
    { label: 'Post-colonial reassessment, 2019 onwards', note: 'Major exhibitions now show the paintings alongside an account of what his presence there actually was.' },
  ],
  summary: 'Paul Gauguin painted this in Tahiti in 1897, on sacking because he could not afford canvas, in about a month, having just learned that his daughter Aline had died of pneumonia in Denmark. He was ill, in debt, and by his own account intending to kill himself as soon as it was done. He finished it, went up into the hills with arsenic, took too much, and vomited it back. He lived another five years. He wrote to his dealer that the picture should be read from right to left, and if you do that it gives up its argument immediately. At the right there is a sleeping baby and three women sitting. In the middle a figure stretches up to pick fruit, which is the ordinary business of being alive. At the left an old woman crouches with her head in her hands, close to death, beside a strange white bird holding a lizard in its claw. The three questions are written by Gauguin in the upper corner, in his own hand. Almost everything supposedly Polynesian in it is invented — the blue idol with its raised arms belongs to no religion anyone has identified — because Gauguin had come looking for an untouched world and found a French colony with a post office. The picture is his masterpiece and, increasingly, a document of what he was doing there.',
},
{
  id: 'the-sleeping-gypsy', category: 'modern',
  title: 'The Sleeping Gypsy', artist: 'Henri Rousseau', artistDates: '1844 – 1910',
  year: '1897', sort: 1897, medium: 'Oil on canvas', dims: '130 × 201 cm',
  museum: 'Museum of Modern Art', city: 'New York',
  file: 'La Bohémienne endormie.jpg', w: 5411, h: 3457, wiki: 'The_Sleeping_Gypsy',
  history: [
    'Rousseau offered it to the mayor of his home town of Laval for two hundred francs, describing it in the letter as a wandering woman asleep with her mandolin and her jar, and a lion passing by who does not devour her. The mayor declined. It sold cheaply and vanished into a Paris charcoal merchant’s shop for twenty-five years.',
    'Rediscovered in 1924, it was so strange that its authenticity was argued over for decades. It came to the Museum of Modern Art in 1939.',
  ],
  depicts: [
    'A sleeping figure in a striped robe lies on sand beside a mandolin and an earthenware jar. A lion stands over her, mane out and tail up, sniffing. A full moon hangs in a blue-black sky above a blue river and low hills.',
    'There are no shadows and there is no wind. The desert is flat and painted like a stage floor, and the lion’s eye is a bead of glass. Everything is described with total confidence and none of it obeys the light.',
  ],
  about: [
    'Rousseau spent his working life as a toll collector on the edge of Paris, which is why he was called Le Douanier, and taught himself to paint in his forties. Critics mocked him for twenty years. Picasso, who found one of his canvases being sold for the price of the fabric, threw a banquet in his honour in 1908. He never left France; every jungle he painted came from the botanical gardens.',
  ],
  echoes: [
    { label: 'Picasso’s banquet for Rousseau (1908)', note: 'Half mockery, half homage, and the moment the avant-garde adopted him.' },
    { label: 'Surrealism', note: 'Breton’s circle claimed him as an ancestor for the dream logic he arrived at without trying.' },
    { label: 'Maurice Sendak, Where the Wild Things Are (1963)', note: 'Sendak named Rousseau as a direct source for the moonlit beasts.' },
  ],
  summary: 'A lion has found a sleeping woman in a desert, and nothing is going to happen. Henri Rousseau described the picture himself, in a letter offering it to the mayor of his home town for two hundred francs: a wandering woman asleep with her mandolin and her jar, and a lion passing by who does not devour her. The mayor said no. The painting disappeared into a charcoal merchant’s shop in Paris for twenty-five years. Rousseau was a toll collector on the edge of the city who taught himself to paint in middle age and was laughed at for two decades by people who could draw better than he could. What they could not do was this. There are no shadows anywhere. There is no wind. The sand is flat as a stage floor, the river is a band of blue, the moon is full, and the lion’s eye is a bead of glass. Every single thing in the picture is stated with complete conviction and none of it behaves the way the world behaves, and the result is a scene that feels less painted than remembered from a dream. Picasso found one of his canvases being sold as scrap and threw a banquet in his honour. The Surrealists later claimed him as an ancestor. He never left France; the jungles in his other paintings came from the botanical gardens in Paris.',
},
{
  id: 'at-the-moulin-rouge', category: 'modern',
  title: 'At the Moulin Rouge: The Dance', artist: 'Henri de Toulouse-Lautrec', artistDates: '1864 – 1901',
  year: '1890', sort: 1890, medium: 'Oil on canvas', dims: '116 × 150 cm',
  museum: 'Philadelphia Museum of Art', city: 'Philadelphia',
  file: 'Henri de Toulouse-Lautrec, French - At the Moulin Rouge- The Dance - Google Art Project.jpg', w: 5889, h: 4476, wiki: 'At_the_Moulin_Rouge:_The_Dance',
  history: [
    'Painted in the Moulin Rouge’s first year. The management bought it and hung it in the entrance hall, which made it the first thing anyone saw on the way in — an advertisement that happened to be a painting.',
    'Toulouse-Lautrec had a table permanently reserved there and drew in it most nights for a decade. His lithographed posters for the same venue, printed in their thousands, effectively invented the modern advertising poster.',
  ],
  depicts: [
    'Valentin le Désossé, the boneless one, teaches a step to a dancer in pink while the room carries on around them. A crowd stands along the back wall — top hats, a woman in black and white, another in salmon pink standing alone and looking out of the picture.',
    'The floor is empty in the centre and everyone has been pushed to the edges, so the two dancers occupy a hole in the composition. The thinned paint and hard outline come from the Japanese prints then flooding Paris.',
  ],
  about: [
    'Toulouse-Lautrec was born to an aristocratic family, broke both thigh bones in his teens, and stopped growing; he reached about a metre and a half. He moved to Montmartre and painted its dancers, prostitutes and drinkers as colleagues rather than subjects, lived for a period in a brothel, drank heavily, and died at thirty-six.',
  ],
  echoes: [
    { label: 'Japanese woodblock prints', note: 'The flat colour, the cropping and the strong outline come straight from them.' },
    { label: 'Toulouse-Lautrec’s posters (1891 onwards)', note: 'The lithographs for this venue created the vocabulary of modern advertising.' },
    { label: 'Baz Luhrmann, Moulin Rouge! (2001)', note: 'The film’s look is assembled almost entirely out of these paintings.' },
  ],
  summary: 'The Moulin Rouge had been open a matter of months when Henri de Toulouse-Lautrec painted this, and the management liked it enough to hang it in the entrance hall, where it worked as an advertisement that happened to be art. The tall thin man at the centre is Valentin le Désossé — Valentin the Boneless — a wine merchant by day and the best dancer in Montmartre by night, and he is showing a step to a woman in pink. Around them the room does what rooms do. Men in top hats stand along the back wall. A woman in black and white watches. Another, in salmon pink, stands by herself at the right and looks out of the picture entirely, at us. Toulouse-Lautrec had a table permanently reserved in this building and drew in it most nights for ten years. He was there as a regular rather than a visitor: an aristocrat’s son who had broken both thighs as a boy, stopped growing at about a metre and a half, and found in Montmartre a set of people who did not much care. The composition empties the centre and pushes everybody to the sides, a trick borrowed from the Japanese prints then arriving in Paris by the crate. Within a year he would take the same flat colour and hard outline into lithography and more or less invent the advertising poster.',
},
{
  id: 'boulevard-montmartre-night', category: 'modern',
  title: 'The Boulevard Montmartre at Night', artist: 'Camille Pissarro', artistDates: '1830 – 1903',
  year: '1897', sort: 1897, medium: 'Oil on canvas', dims: '53 × 65 cm',
  museum: 'National Gallery', city: 'London',
  file: 'Pissarro - The Boulevard Montmartre at Night (1897).jpg', w: 15224, h: 12533, wiki: 'The_Boulevard_Montmartre_at_Night',
  tags: ['landscape'],
  history: [
    'One of fourteen views Pissarro painted from a window of the Hôtel de Russie over a single winter, working through the series as the weather and the hour changed. He was in his late sixties, with an eye condition that made painting outdoors painful, and had taken to working from rooms above streets.',
    'It is the only night scene in the set, and among the first paintings anywhere to take electric street lighting as its subject.',
  ],
  depicts: [
    'A wet boulevard seen from above at night. Lamps run down both sides in receding rows, shop windows throw yellow light across the pavement, carriages and pedestrians dissolve into smears, and the whole road surface has become a reflection.',
    'Almost nothing is described. Every figure on that street is one or two marks. The picture works because the eye reads a rain-slicked boulevard out of colour and rhythm alone, which is the entire Impressionist argument compressed into one canvas.',
  ],
  about: [
    'Pissarro was born in the Danish West Indies, came to Paris at twenty-five, and was the only painter to show in all eight Impressionist exhibitions. He was the group’s hinge — he taught Cézanne and Gauguin, argued with everyone, went through a Pointillist phase in his fifties and came out the other side — and he lost a life’s work when Prussian troops occupied his house in 1870.',
  ],
  echoes: [
    { label: 'Monet’s Rouen Cathedral series (1892 – 94)', note: 'The same method: one view, many canvases, the real subject being the light.' },
    { label: 'Electric street lighting in Paris', note: 'New enough in 1897 to be the reason for painting the picture at all.' },
    { label: 'Van Gogh, Café Terrace at Night (1888)', note: 'The other great early attempt at artificial light out of doors.' },
  ],
  summary: 'Camille Pissarro was sixty-seven, his eyes were troubling him, and standing at an easel in the street had become difficult. So he took a room in a hotel on the Boulevard Montmartre and painted what was underneath the window — fourteen times, through one winter, as the light and the weather and the hour changed. Thirteen of those canvases are daylight. This is the other one. It is, as far as anyone can tell, among the first paintings in history to take electric street lighting as its subject. The boulevard is wet, and the entire surface of the road has become a mirror: the lamps run away in two receding rows, the shop windows throw yellow across the pavement, and the carriages and people are nothing but smears of paint moving through it. Go close and there is no detail anywhere. Not a face, not a wheel, not a window frame — every figure on that street is one or two marks. Stand back and it is unmistakably a Paris evening in the rain. That gap, between what is on the canvas and what you see, is the whole Impressionist proposition, and here it is doing something the movement had mostly avoided, which is night. Pissarro was the only one of the group to exhibit in all eight of their shows, and he taught both Cézanne and Gauguin.',
},
{
  id: 'the-childs-bath', category: 'modern',
  title: 'The Child’s Bath', artist: 'Mary Cassatt', artistDates: '1844 – 1926',
  year: '1893', sort: 1893, medium: 'Oil on canvas', dims: '100 × 66 cm',
  museum: 'Art Institute of Chicago', city: 'Chicago',
  file: "Mary Cassatt - The Child's Bath - Google Art Project.jpg", w: 3219, h: 4912, wiki: 'The_Child%27s_Bath',
  history: [
    'Painted the year after Cassatt completed a mural nearly twenty metres long, called Modern Woman, for the Woman’s Building at the Chicago World’s Fair — a commission that was dismantled when the fair closed and has never been found.',
    'It comes directly out of a set of ten colour prints she made in 1890 and 1891, after seeing a vast exhibition of Japanese woodblock prints in Paris that changed her drawing permanently. The Art Institute bought it in 1910.',
  ],
  depicts: [
    'Seen from above, a woman holds a child on her lap with one arm around her and washes her foot in a basin on the floor. The child’s hand rests on her own knee. Both look down at the water, and neither looks out.',
    'Everything is pattern — the striped dress, the flowered wallpaper, the carpet, the jug — except the bare skin, which gives the only plain surfaces in the picture and is therefore the only place the eye will settle.',
  ],
  about: [
    'Cassatt was born in Pennsylvania, moved to Paris against her father’s wishes, and was the only American invited to exhibit with the Impressionists, by Degas, who became a lifelong and difficult friend. She never married, campaigned for women’s suffrage, and advised the American collectors whose purchases built much of what now hangs in United States museums.',
  ],
  echoes: [
    { label: 'Kitagawa Utamaro’s mother-and-child prints', note: 'The overhead viewpoint, the flattened pattern and the cropping all come from here.' },
    { label: 'Degas and the 1879 Impressionist exhibition', note: 'Degas invited her to show with the group; she called it the turning point of her life.' },
    { label: 'Modern Woman, Chicago World’s Fair (1893)', note: 'Her largest work, painted the year before this one, and lost within a decade.' },
  ],
  summary: 'A woman is washing a child’s foot, and the entire picture is arranged around that small fact. Mary Cassatt painted it in 1893, and the first thing to notice is the viewpoint. We are looking down into the scene, steeply, from somewhere above and to the side, so the floor tips up towards us and the basin becomes an oval. That angle is not European. Cassatt had seen an enormous exhibition of Japanese woodblock prints in Paris in 1890, and it rearranged her sense of what a picture could do — the high viewpoint, the flattened pattern, the willingness to crop a figure at the edge. The second thing is the patterning. The striped dress, the flowered wallpaper, the carpet, the jug: almost every surface is busy. The exceptions are the areas of bare skin, the child’s legs and the two pairs of hands, which are the only quiet places in the painting and are therefore exactly where you look. Nobody is performing. Neither of them glances out at us; both are watching the water. Cassatt was an American who moved to Paris against her family’s wishes and became the only American invited to show with the Impressionists. She painted mothers and children for thirty years and was patronised for it by people who thought the subject too small.',
},
{
  id: 'water-lilies', category: 'modern',
  title: 'Water Lilies', artist: 'Claude Monet', artistDates: '1840 – 1926',
  year: '1920', sort: 1920, medium: 'Oil on canvas', dims: '200 × 425 cm',
  museum: 'Museum of Modern Art', city: 'New York',
  file: 'Reflections of Clouds on the Water-Lily Pond.jpg', w: 3463, h: 1978, wiki: 'Water_Lilies_(Monet_series)',
  tags: ['landscape'],
  history: [
    'Monet painted roughly two hundred and fifty water lily canvases over the last thirty years of his life, in a garden he built himself at Giverny, diverting a stream to make the pond and importing the lilies over the objections of neighbours who thought they would poison the water.',
    'He worked on the largest panels through the First World War, with the front close enough that he could hear the guns, and gave a set to France the day after the Armistice. Cataracts ruined his sight; he had surgery in 1923 and went back to repaint work he had made half blind.',
  ],
  depicts: [
    'Water, lilies, and the reflections of clouds and willows. There is no horizon, no bank, and no sky except the sky in the water.',
    'Removing the horizon is the whole move. Without it there is no ground plane and no depth cue, so the painted surface and the depicted surface become the same thing — which is why American painters half a century later found these canvases so useful.',
  ],
  about: [
    'Monet gave Impressionism its name by accident, with a canvas called Impression, Sunrise. He outlived the rest of the group by decades, became wealthy and famous, and spent his last thirty years painting one pond. He died at eighty-six with the great decorations still unfinished to his satisfaction.',
  ],
  echoes: [
    { label: 'The Orangerie panels, Paris (1927)', note: 'Eight compositions in two oval rooms, given to the state and opened months after his death.' },
    { label: 'Jackson Pollock and Abstract Expressionism', note: 'New York in the 1950s rediscovered the late Monet and read him as an ancestor.' },
    { label: 'Monet’s cataracts', note: 'Diagnosed in 1912; the colour of the late work shifts with his sight, and again after surgery.' },
  ],
  summary: 'There is no horizon in this painting. That is the thing to notice, and everything else follows from it. Claude Monet spent the last thirty years of his life painting one pond, roughly two hundred and fifty times. He had built it himself at Giverny, diverting a stream against the objections of local farmers who believed his imported lilies would poison the water, and then he painted it in every light there was. In the late canvases, of which this is one, he did something without real precedent: he took away the bank, the sky and the far edge, and pointed the picture straight down at the water. What is left is lilies, and the reflections of clouds and willows in the surface they are floating on. There is no way to tell how deep it is, or which way is up, and no ground for your eye to stand on. He worked on these through the First World War — Giverny is close enough to the Marne that he could hear the artillery — and gave a set of the largest to France the day after the Armistice. His eyes were failing throughout. Cataracts turned his palette muddy and then red, and after surgery in 1923 he went back and repainted canvases he had made half blind. Fifty years later, painters in New York looked at these and saw the beginning of abstraction.',
},
{
  id: 'self-portrait-with-physalis', category: 'modern',
  title: 'Self-Portrait with Physalis', artist: 'Egon Schiele', artistDates: '1890 – 1918',
  year: '1912', sort: 1912, medium: 'Oil and gouache on wood', dims: '32 × 40 cm',
  museum: 'Leopold Museum', city: 'Vienna',
  file: 'Egon Schiele - Self-Portrait with Physalis - Google Art Project.jpg', w: 3781, h: 3062, wiki: 'Self-Portrait_with_Physalis',
  tags: ['portrait'],
  history: [
    'Painted in the year Schiele spent twenty-four days in custody. He had been arrested in a small town outside Vienna on serious charges that were dropped; he was convicted instead of leaving an indecent drawing where children could see it, and a judge burned one of his works in the courtroom.',
    'It was made as one of a pair with a portrait of Wally Neuzil, his partner and model, designed to hang side by side and turn towards each other. The two were separated for most of the twentieth century.',
  ],
  depicts: [
    'The painter at twenty-two, head tilted, one shoulder hitched up, in three-quarter view against bare board. A branch of physalis — Chinese lanterns — crosses the upper right with its papery orange husks and wiry stems.',
    'The plant is doing the work of a landscape, a curtain and a signature at once. Everything else is stripped away: no room, no furniture, no depth. The board is left bare wherever nothing needed to be said.',
  ],
  about: [
    'Schiele entered the Vienna Academy at sixteen, walked out at nineteen, and was taken up by Klimt, who bought his drawings and sent him clients. He made about three hundred paintings and several thousand drawings in ten years. He died in the influenza pandemic of 1918, aged twenty-eight, three days after his pregnant wife.',
  ],
  echoes: [
    { label: 'Gustav Klimt', note: 'Mentor and patron; the ornament in Schiele is Klimt’s, the anatomy is not.' },
    { label: 'Portrait of Wally Neuzil (1912)', note: 'Its companion, painted to hang facing it, and the subject of a long restitution case.' },
    { label: 'The 1918 influenza pandemic', note: 'It killed Klimt in February and Schiele in October, ending Viennese modernism inside a year.' },
  ],
  summary: 'Egon Schiele was twenty-two when he painted this, and he had spent part of that year in a cell. He had been living in a small town outside Vienna with his partner Wally Neuzil, and the town did not care for either of them. He was arrested on serious charges that were dropped, convicted instead of leaving an indecent drawing where a child could see it, and made to watch a judge burn one of his works over a candle flame. He served twenty-four days. The picture that came out of that year is small, painted on wood, and almost empty. There is no room behind him, no furniture, no depth of any kind — just bare board, a head tilted at an angle a neck does not comfortably make, one shoulder hitched up, and a branch of physalis crossing the top right corner with its orange paper lanterns and its wiry stems. That plant is carrying the entire picture. It is the landscape, the decoration and the signature all at once, and it is the only thing in the painting that is not him. It was made as one of a pair, designed to hang beside a portrait of Wally so that the two of them would be turning towards each other. Six years later Schiele died in the influenza pandemic at twenty-eight, three days after his pregnant wife.',
},
{
  id: 'twittering-machine', category: 'modern',
  title: 'Twittering Machine', artist: 'Paul Klee', artistDates: '1879 – 1940',
  year: '1922', sort: 1922, medium: 'Oil transfer drawing, watercolour and ink on paper', dims: '64 × 48 cm',
  museum: 'Museum of Modern Art', city: 'New York',
  file: 'Paul-klee-twittering-machine-1.jpg', w: 4581, h: 6144, wiki: 'Twittering_Machine',
  history: [
    'Made at the Bauhaus in Weimar, where Klee taught alongside Kandinsky. He used his own oil-transfer method: a sheet coated in black oil paint laid under the paper and drawn on from above, so the line comes through smudged and slightly out of his control rather than confident.',
    'The Museum of Modern Art bought it in 1939. By then the Nazis had declared Klee degenerate, seized more than a hundred of his works from German collections, and driven him out of his teaching post and back to Switzerland.',
  ],
  depicts: [
    'Four thin birds, or things standing in for birds, are mounted on a wire that runs to a hand crank. Turn the handle and they will presumably sing. Beneath them the ground gives way into a pit of violet.',
    'The joke has a floor under it. A machine for producing birdsong is charming until you notice the birds are threaded onto the wire like beads, their beaks are open far too wide, and there is a hole underneath waiting for whatever the crank attracts.',
  ],
  about: [
    'Klee was a Swiss-German painter and trained musician who played the violin well enough to have gone professional. He taught at the Bauhaus for a decade and left notebooks of teaching theory that have been compared to Leonardo’s. He made nearly ten thousand works, was paraded by the Nazis as degenerate, and died in 1940 of scleroderma.',
  ],
  echoes: [
    { label: 'Theodor Adorno and the Frankfurt School', note: 'Read it as mechanisation turning even birdsong into product.' },
    { label: 'Degenerate Art exhibition, Munich (1937)', note: 'Klee was among the artists displayed in it; about a hundred works were confiscated.' },
    { label: 'Aaron Jay Kernis, Twittering Machines', note: 'One of several musical works that take the painting as a score.' },
  ],
  summary: 'Four birds sit on a wire, and the wire is attached to a crank. Turn the handle, and they will sing. Paul Klee made this at the Bauhaus in 1922, where he was teaching alongside Kandinsky, and he made it with a technique he had invented for himself: he coated a sheet in black oil paint, laid it face down under his drawing paper, and drew on the back, so that the line came through smudged, hesitant and slightly beyond his control. That wobble is why the machine looks hand-built and faintly pathetic rather than engineered. It is funny, and then it is not. Look at how the birds are attached. They are not perched on the wire; they are threaded onto it like beads, with their beaks open much too wide for singing. And underneath them the ground gives way into a pit of violet, a hole the picture offers no explanation for. A device that manufactures birdsong on demand, with the birds fixed in place, and something waiting below. Klee made nearly ten thousand works in his life and taught for a decade, leaving notebooks that get compared to Leonardo’s. In 1937 the Nazis put him in the Degenerate Art exhibition, seized a hundred of his pictures, and he went home to Switzerland to die.',
},
{
  id: 'the-city-rises', category: 'modern',
  title: 'The City Rises', artist: 'Umberto Boccioni', artistDates: '1882 – 1916',
  year: '1910', sort: 1910, medium: 'Oil on canvas', dims: '199 × 301 cm',
  museum: 'Museum of Modern Art', city: 'New York',
  file: 'The City Rises by Umberto Boccioni 1910.jpg', w: 2583, h: 1715, wiki: 'The_City_Rises',
  history: [
    'Painted in Milan in 1910, the year after Marinetti published the Futurist Manifesto on the front page of Le Figaro, declaring that a racing car was more beautiful than the Victory of Samothrace and that Italy should drain its canals and demolish its museums.',
    'Boccioni called it his first great work. Six years later he was dead at thirty-three, thrown from a horse during cavalry training for a war the Futurists had campaigned loudly to enter.',
  ],
  depicts: [
    'An enormous red horse fills the centre, straining forward, with labourers hauling at it and being dragged off their feet. Behind them scaffolding goes up over a new suburb, and the whole surface is broken into short divided strokes so that nothing holds still.',
    'The subject is a building site — the expansion of industrial Milan — treated as though it were a battle or a myth. The horse is the muscle of the new century, and the men are barely keeping hold of it.',
  ],
  about: [
    'Boccioni was the most gifted of the Italian Futurists, a painter and sculptor who theorised the group’s ideas as well as illustrating them. Futurism’s worship of speed, machinery and violence fed directly into Italian Fascism afterwards, which complicates its legacy considerably. He enlisted in 1915 and died the following year.',
  ],
  echoes: [
    { label: 'F. T. Marinetti, Futurist Manifesto (1909)', note: 'Published in Paris and Milan; this painting is its first major answer in paint.' },
    { label: 'Boccioni, Unique Forms of Continuity in Space (1913)', note: 'The striding bronze figure that now appears on the Italian twenty-cent coin.' },
    { label: 'Fritz Lang, Metropolis (1927)', note: 'The same faith in the machine city, seventeen years on and a great deal darker.' },
  ],
  summary: 'A vast red horse lunges through the middle of this painting and men are hanging off it, dragged forward with their heels in the dirt. Behind them scaffolding is going up over a new suburb of Milan. That is the subject: a building site. Umberto Boccioni painted it in 1910, the year after Filippo Marinetti had published the Futurist Manifesto on the front page of a Paris newspaper, announcing that a roaring motor car was more beautiful than a Greek statue, that museums were cemeteries, and that Italy should tear up its past and begin again. This is what that sounded like as a painting. Everything is broken into short separated strokes of colour so that no edge sits still and the whole canvas seems to shudder. The horse is not really a horse; it is the raw force of the new century, and the men are not controlling it, they are holding on. Boccioni called it his first great work. It is worth knowing what happened next. The Futurists campaigned hard for Italy to enter the First World War, because they believed a war would cleanse the country of its past, and they got what they wanted. Boccioni enlisted, and in 1916 he was thrown from a horse during cavalry training and died of his injuries. He was thirty-three.',
},
];

if (typeof module !== 'undefined') module.exports = { CATEGORIES, ARTWORKS };
