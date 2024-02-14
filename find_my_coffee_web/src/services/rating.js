// rating.js

import Api from './api';

const RatingService = {
  // Função para criar uma nova avaliação
  create: (store, rating) => Api.post('/ratings', { store: store, rating: rating} )

}

export default RatingService;
