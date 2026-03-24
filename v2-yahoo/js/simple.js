simply.on('accelTap', function(e) {
  subt = 'Your thing moved ' + (e.direction > 0 ? '+' : '-') + e.axis
  simply.subtitle(subt);
});
setInterval(function() {
    simply.vibe('short');
}, 2000);
