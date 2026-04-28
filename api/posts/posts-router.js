// posts için gerekli routerları buraya yazın
const express = require('express');
const router = express.Router();

const Post = require('./posts-model');

module.exports = router;

router.get('/', async (req, res) => {
    try { 
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch(err) {
        res.status(500).json({message: "Gönderiler alınmadı"});
    }
});

router.get('/:id', async (req, res) => {
    try {
        const {id} = req.params;

        const post = await Post.findById(id);

        if(!post) {
            return res.status(404).json({message: "Belirtilen ID'li gönderi bulunamadı"});
        }

        res.status(200).json(post);
    } catch(err) {
        res.status(500).json({message: "Gönderi bilgisi alınmadı"})
    }
});

router.post('/', async (req,res) => {
    try {
        const {title, contents}= req.body;

        if(!title || !contents){
            return res.status(400).json({message: "Lütfen gönderi için bir title ve contents sağlayın"});
        }

        const inserted = await Post.insert({title, contents});

        const newPost = await Post.findById(inserted.id);

        res.status(201).json(newPost);
    } catch(err) {
        res.status(500).json({message: "Veri tabanına kaydedilirken bir hata oluştu"})
    }
});

router.put('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const {title, contents} = req.body;

        const post = await Post.findById(id);
        if(!post) {
            return res.status(404).json({message: "Belirtilen ID'li gönderi bulunamadı"})
        }

        if(!title || !contents) {
            return res.status(400).json({message: " Lütfen gönderi için title ve contents sağlayın"});
        }
        

    await Post.update(id, {title, contents});

    const updatedPost = await Post.findById(id);

    res.status(200).json(updatedPost); 

    } catch(err) {
        res.status(500).json({message: "Gönderi bilgileri güncellenemedi"});
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const {id} = req.params;

        const post = await Post.findById(id);

        if(!post) {
            return res.status(404).json({message: "Belirtilen ID li gönderi bulunamadı"})
        }

        await Post.remove(id);
        
        res.status(200).json(post);
    } catch(err) {
        res.status(500).json({message: "Gönderi silinemedi"})
    }
})

router.get('/:id/comments', async (req, res) => {
    try {
        const {id} = req.params;

        const post =await Post.findById(id)

        if(!post) {
            return res.status(404).json({message: "Girilen ID'li gönderi bulunamadı"})
        }

        const comments = await Post.findPostComments(id);

        res.status(200).json(comments);
    } catch(err) {
        res.status(500).json({message: "Yorumlar bilgisi getirilemedi"})
    }
})