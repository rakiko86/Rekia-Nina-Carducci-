;(function ($) {
  $.fn.mauGallery = function (options) {
    var options = $.extend({}, $.fn.mauGallery.defaults, options)
    var tagsCollection = []
    return this.each(function () {
      $.fn.mauGallery.methods.createRowWrapper($(this))
      if (options.lightBox) {
        $.fn.mauGallery.methods.createLightBox(
          $(this),
          options.lightboxId,
          options.navigation
        )
      }
      $.fn.mauGallery.listeners(options)
      $(this)
        .children('.gallery-item')
        .each(function () {
          $.fn.mauGallery.methods.responsiveImageItem($(this))
          $.fn.mauGallery.methods.moveItemInRowWrapper($(this))
          $.fn.mauGallery.methods.wrapItemInColumn($(this), options.columns)
          var theTag = $(this).data('gallery-tag')
          if (
            options.showTags &&
            theTag !== undefined &&
            tagsCollection.indexOf(theTag) === -1
          ) {
            tagsCollection.push(theTag)
          }
        })
      if (options.showTags) {
        $.fn.mauGallery.methods.showItemTags(
          $(this),
          options.tagsPosition,
          tagsCollection
        )
      }
      $(this).fadeIn(500)
    })
  }
  $.fn.mauGallery.defaults = {
    columns: 3,
    lightBox: true,
    lightboxId: null,
    showTags: true,
    tagsPosition: 'bottom',
    navigation: true
  }
  $.fn.mauGallery.listeners = function (options) {
    $('.gallery-item').on('click', function () {
      if (options.lightBox && $(this).is('img')) {
        $.fn.mauGallery.methods.openLightBox($(this), options.lightboxId)
      }
    })
    $('.gallery').on('click', '.mg-prev', function () {
      $.fn.mauGallery.methods.prevImage(options.lightboxId)
    })
    $('.gallery').on('click', '.mg-next', function () {
      $.fn.mauGallery.methods.nextImage(options.lightboxId)
    })
    $('.gallery').on('click', '.nav-link', function () {
      const tag = $(this).data('images-toggle')
      $.fn.mauGallery.methods.filterByTag.call(this, tag)
    })
  }
  $.fn.mauGallery.methods = {
    createRowWrapper (element) {
      if (!element.children().first().hasClass('row')) {
        element.append('<div class="gallery-items-row row"></div>')
      }
    },
    wrapItemInColumn (element, columns) {
      let columnClasses = ''
      if (typeof columns === 'number') {
        columnClasses = ` col-${Math.ceil(12 / columns)}`
      } else if (typeof columns === 'object') {
        if (columns.xs) columnClasses += ` col-${Math.ceil(12 / columns.xs)}`
        if (columns.sm) columnClasses += ` col-sm-${Math.ceil(12 / columns.sm)}`
        if (columns.md) columnClasses += ` col-md-${Math.ceil(12 / columns.md)}`
        if (columns.lg) columnClasses += ` col-lg-${Math.ceil(12 / columns.lg)}`
        if (columns.xl) columnClasses += ` col-xl-${Math.ceil(12 / columns.xl)}`
      } else {
        console.error(
          `Columns should be defined as numbers or objects. ${typeof columns} is not supported.`
        )
        return
      }
      element.wrap(`<div class='item-column mb-4${columnClasses}'></div>`)
    },
    moveItemInRowWrapper (element) {
      element.appendTo('.gallery-items-row')
    },
    responsiveImageItem (element) {
      if (element.is('img')) {
        element.addClass('img-fluid')
      }
    },
    openLightBox (element, lightboxId) {
      $(`#${lightboxId}`)
        .find('.lightboxImage')
        .attr('src', element.attr('src'))
      $(`#${lightboxId}`).modal('toggle')
    },
    prevImage (lightboxId) {
      let activeImage = $('.lightboxImage').attr('src')
      let imagesCollection = this.getImagesCollection()
      let index = imagesCollection.indexOf(activeImage)
      let prev =
        index > 0
          ? imagesCollection[index - 1]
          : imagesCollection[imagesCollection.length - 1]
      $('.lightboxImage').attr('src', prev)
    },
    nextImage (lightboxId) {
      let activeImage = $('.lightboxImage').attr('src')
      let imagesCollection = this.getImagesCollection()
      let index = imagesCollection.indexOf(activeImage)
      let next =
        index < imagesCollection.length - 1
          ? imagesCollection[index + 1]
          : imagesCollection[0]
      $('.lightboxImage').attr('src', next)
    },
    getImagesCollection () {
      return $('.gallery-item')
        .map(function () {
          return $(this).attr('src')
        })
        .get()
    },
    createLightBox (gallery, lightboxId, navigation) {
      gallery.append(`<div class="modal fade" id="${
        lightboxId || 'galleryLightbox'
      }" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-body">
              ${
                navigation
                  ? '<div class="mg-prev" style="cursor:pointer;position:absolute;top:50%;left:-15px;background:white;"><</div>'
                  : '<span style="display:none;" />'
              }
              <img class="lightboxImage img-fluid" alt="Contenu de l\'image affichée dans la modale au clique"/>
              ${
                navigation
                  ? '<div class="mg-next" style="cursor:pointer;position:absolute;top:50%;right:-15px;background:white;">></div>'
                  : '<span style="display:none;" />'
              }
            </div>
          </div>
        </div>
      </div>`)
    },
    showItemTags (gallery, position, tags) {
      var tagItems =
        '<li class="nav-item"><span class="nav-link active active-tag" data-images-toggle="all">Tous</span></li>'
      $.each(tags, function (index, value) {
        tagItems += `<li class="nav-item"><span class="nav-link" data-images-toggle="${value}">${value}</span></li>`
      })
      var tagsRow = `<ul class="my-4 tags-bar nav nav-pills">${tagItems}</ul>`
      if (position === 'bottom') {
        gallery.append(tagsRow)
      } else if (position === 'top') {
        gallery.prepend(tagsRow)
      }
    },
    filterByTag (tag) {
      $('.nav-link').removeClass('active active-tag')
      $(this).addClass('active active-tag')
      $('.gallery-item').show() 
      $('.gallery-item').each(function () {
        const itemTag = $(this).data('gallery-tag')
        if (itemTag !== tag && tag !== 'all') {
          $(this).hide() // Masque les éléments non sélectionnés
        }
      })
    }
  }
})(jQuery)
