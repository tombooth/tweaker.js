
(function() {


   function Tweaker(element, alignment) {
      this.panels = [].slice.call(element.querySelectorAll('div'))
                      .map(function(panelElem) { return { element: panelElem }; });

      this._element = element;
      this._pinned = false;
      this._open = false;
      this._pinLink = null;

      this._buildDom();
      this.changeAlignment(alignment || Tweaker.ALIGN.RIGHT);
   }

   Tweaker.prototype.openPanel = function(panel) {

      var showing = panel.element.classList.contains('hidden') || 
                  (panel.link.classList.contains('selected') && this._pinned);

      this.hide();

      if (showing) { 
         this._element.classList.add('open');
         panel.element.classList.remove('hidden');
         panel.link.classList.add('selected');
         this._open = true;
      } else {
         panel.element.classList.add('hidden');
      }

   };

   Tweaker.prototype.changeAlignment = function(alignment) {

      var element = this._element;

      Object.keys(Tweaker.ALIGN).map(function(key) { return Tweaker.ALIGN[key]; })
            .forEach(function(cssClass) {
               document.body.classList.remove('tweaker-' + cssClass);
               element.classList.remove(cssClass);
            });

      document.body.classList.add('tweaker-' + alignment);
      element.classList.add(alignment);

   };

   Tweaker.prototype.show = function() {

      this.openPanel(this.panels[0]);

   };

   Tweaker.prototype.hide = function() {

      for (var i = 0; i < this.panels.length; i++) {
         this.panels[i].element.classList.add('hidden');
         this.panels[i].link.classList.remove('selected');
      }

      if (!this._pinned) {
         this._element.classList.remove('open');
         this._open = false;
      }

   };

   Tweaker.prototype._buildDom = function() {

      var panelsElement = document.createElement('ul'),
          toolsElement = document.createElement('ul'),
          panel;

      this._element.classList.add('tweaker');
      panelsElement.classList.add('panels');
      toolsElement.classList.add('tools');

      this._pinLink = this._addLinkTo(toolsElement, 'Pin', this._pinClicked.bind(this));

      for (var i = 0; i < this.panels.length; i++) {

         panel = this.panels[i];
         panel.element.classList.add('panel');
         panel.element.classList.add('hidden');

         panel.link = this._addLinkTo(panelsElement, 
               panel.element.getAttribute('data-title'), this._linkClicked.bind(this, panel));

      }

      document.documentElement.addEventListener('mousedown', this._bodyClicked.bind(this));

      this._element.appendChild(panelsElement);
      this._element.appendChild(toolsElement);

   };

   Tweaker.prototype._addLinkTo = function(element, text, clickHandler) {

      var linkContainer = document.createElement('li'),
          link = document.createElement('a');

      linkContainer.className = 'link-item';

      link.href = '#';
      link.innerText = text;
      link.addEventListener('click', clickHandler);

      linkContainer.appendChild(link);
      element.appendChild(linkContainer);

      return link;

   };

   Tweaker.prototype._pinClicked = function(evt) {

      evt.preventDefault();

      if (this._pinned) {
         document.body.classList.remove('tweaker-pinned');
         this._pinLink.classList.remove('selected');
      } else {
         document.body.classList.add('tweaker-pinned');
         this._pinLink.classList.add('selected');

         if (!this._open) {
            this.show();
         }
      }

      this._pinned = !this._pinned;

   };

   // walk up the dom to see if the target is part of the settings view
   // if not then hide
   Tweaker.prototype._bodyClicked = function(evt) {
   
      var elem = evt.target,
          clickInTweakerPanel = false;

      do {
         if (elem === this._element) { clickInTweakerPanel = true; break; }
      } while(elem = elem.parentNode);

      if (!clickInTweakerPanel && !this._pinned) this.hide();

   };

   Tweaker.prototype._linkClicked = function(panel, evt) {

      evt.preventDefault();
      this.openPanel(panel);

   };


   Tweaker.ALIGN = {
      RIGHT: 'right',
      BOTTOM: 'bottom',
      LEFT: 'left',
      TOP: 'top'
   };


   window.Tweaker = Tweaker;

}());
