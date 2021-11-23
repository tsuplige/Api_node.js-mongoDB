//@ts-nocheck

const Sauce = require('../models/sauce');

const fs = require('fs');

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    console.log(sauceObject);
    const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save().then(
    () => {
      res.status(201).json({
        message: 'Post saved successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
      {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet modifié !'}))
      .catch(error => res.status(400).json({ error }));
  };

  exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {

        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
  };

exports.getAllSauce = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};


exports.addLike = (req, res, next) =>  {
    Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {

      switch(req.body.like) {

        /* si like = 0
        * et que user est dans userLiked
        * on le supprime de userliked et on décrémente likes
        * ou que user est dans userDisliked
        * on le supprime de userdisliked et on décrémente dislikes
        * pull dans la bonne table
        * on décrémente likes ou dislikes en fonction */


        case 0 :
          
          if (sauce.userLiked.includes(req.body.userId)){
            sauce.userLiked.pull(req.body.userId)
            sauce.likes--
            sauce.save()
            .then(() => res.status(201).json({ message: "like retiré" }))
            .catch((error) => res.status(400).json({ error }));
          } else if (sauce.userDisliked.includes(req.body.userId)) {
            sauce.userDisliked.pull(req.body.userId)
            sauce.dislikes--;
            sauce.save()
            .then(() => res.status(201).json({ message: "dislike retiré" }))
            .catch((error) => res.status(400).json({ error }));
          }
          break;

          /* si like=1 et que user n'est pas dans userliked
          * push userId dans userliked
          * on incrémente likes
          * sinon on revoie une erreur pour le doublont */


        case 1:

          if (!sauce.userLiked.includes(req.body.userId)){
            sauce.userLiked.push(req.body.userId)
            sauce.likes++;
            sauce.save()
            .then(() => res.status(201).json({ message: "Sauce likée" }))
            .catch((error) => res.status(400).json({ error }));
          } else {
            res.status(403).json({ message: "vous avez deja liké la sauce"})
            .catch((error) => res.status(400).json({ error }));
          }
          break;

          /* si like= -1 et que user n'est pas dans userdisliked
          * push userId dans userDisliked
          * on incrémente dislikes
          * sinon on revoie une erreur pour le doublont */


        case -1:

          if (!sauce.userDisliked.includes(req.body.userId)){
            sauce.userDisliked.push(req.body.userId)
            sauce.dislikes++;
            sauce.save()
            .then(() => res.status(201).json({ message: "Sauce dislikée" }))
            .catch((error) => res.status(400).json({ error }));
          }
          else {
            res.status(403).json({ message: "vous avez deja disliké la sauce"})
            .catch((error) => res.status(400).json({ error }));
          }
          break;

        default:
          res.status(403).json({ message: "ERROR"})
            .catch((error) => res.status(400).json({ error }));

      }
          
    })
    .catch((error) => res.status(500).json({ error }));
  }