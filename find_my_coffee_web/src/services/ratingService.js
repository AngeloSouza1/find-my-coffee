// ratingService.js
const { REACT_APP_GOOGLE_API_KEY } = process.env;

class RatingService {
    static async getReviews(placeId) {
      try {
        const response = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${REACT_APP_GOOGLE_API_KEY}`);
        const data = await response.json();
        // Verifique a estrutura do objeto data e ajuste o acesso aos comentários dos usuários
        if (data && data.result && data.result.reviews) {
          return data.result.reviews; // Retornar os comentários dos usuários
        } else {
          throw new Error('Comentários não encontrados');
        }
      } catch (error) {
        throw new Error('Erro ao carregar avaliações: ' + error.message);
      }
    }
}

export default RatingService;
