import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import YouTube from 'react-youtube';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faPlay, 
  faVideo, 
  faCalendarAlt, 
  faClock, 
  faStar,
  faHeart,
  faTimes,
  faBookmark
} from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { getMovieDetails, getMovieTrailer, getImageUrl } from '../services/tmdbApi';
import { addToFavorites, removeFromFavorites, isFavorite } from '../services/favoritesService';
import libraryService from '../services/libraryService';
import { useAuth } from '../contexts/AuthContext';

const PageContainer = styled.div`
  min-height: 100vh;
`;

const HeroSection = styled.div`
  position: relative;
  height: 100vh;
  background-image: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.8)), 
                    url(${props => props.backdropUrl});
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  padding: 0 2rem;
`;

const BackButton = styled.button`
  position: absolute;
  top: 2rem;
  left: 2rem;
  background: rgba(0, 0, 0, 0.7);
  border: none;
  color: white;
  padding: 0.5rem;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1rem;
  width: 40px;
  height: 40px;
  transition: all 0.3s ease;
  z-index: 10;

  &:hover {
    background: rgba(0, 0, 0, 0.9);
    transform: scale(1.1);
  }
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 3rem;
  align-items: start;
`;

const PosterContainer = styled.div`
  position: relative;
`;

const MoviePoster = styled.img`
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
`;

const FavoriteButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.8);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  color: ${props => props.isFavorited ? '#9333ea' : '#ffffff'};
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 0, 0, 1);
    transform: scale(1.1);
  }
`;

const LibraryButton = styled.button`
  position: absolute;
  top: 4rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.8);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  color: ${props => props.isInLibrary ? '#3b82f6' : '#ffffff'};
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 0, 0, 1);
    transform: scale(1.1);
  }
`;

const MovieInfo = styled.div`
  color: white;
`;

const MovieTitle = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.2;
`;

const MovieMeta = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
`;

const Rating = styled.span`
  background: linear-gradient(45deg, #9333ea, #a855f7);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
`;

const GenreList = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const Genre = styled.span`
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
`;

const Overview = styled.p`
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  max-width: 800px;
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const WatchButton = styled.button`
  background: linear-gradient(45deg, #9333ea, #a855f7);
  color: white;
  border: none;
  padding: 0.875rem 2rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(147, 51, 234, 0.4);
  }
`;

const TrailerButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.875rem 2rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
  }
`;

const TrailerModal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 2rem;
`;

const TrailerContainer = styled(motion.div)`
  position: relative;
  width: 100%;
  max-width: 1000px;
  height: 0;
  padding-bottom: 45%;
  border-radius: 12px;
  overflow: hidden;
  background: #000;

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: -50px;
  right: 0;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 0.75rem;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const CastSection = styled.div`
  padding: 3rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 2rem;
  color: white;
`;

const CastGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1.5rem;
`;

const CastMember = styled.div`
  text-align: center;
  color: white;
`;

const CastImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 0.5rem;
`;

const CastName = styled.div`
  font-weight: 600;
  margin-bottom: 0.2rem;
`;

const CastCharacter = styled.div`
  font-size: 0.9rem;
  color: #ccc;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.5rem;
  color: white;
`;

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.5rem;
  color: #9333ea;
  text-align: center;
`;

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorited, setFavorited] = useState(false);
  const [isInLibrary, setIsInLibrary] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerKey, setTrailerKey] = useState(null);

  useEffect(() => {
    loadMovieDetails();
  }, [id]);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (movie && user) {
        const status = await isFavorite(user.id, movie.id);
        setFavorited(status);
      }
    };
    checkFavoriteStatus();
  }, [movie, user]);

  useEffect(() => {
    const checkLibraryStatus = async () => {
      if (movie && user) {
        const status = await libraryService.isInLibrary(user.id, movie.id);
        setIsInLibrary(status);
      }
    };
    checkLibraryStatus();
  }, [movie, user]);

  const loadMovieDetails = async () => {
    try {
      setLoading(true);
      const movieData = await getMovieDetails(id);
      setMovie(movieData);
      
      const trailer = getMovieTrailer(movieData.videos);
      setTrailerKey(trailer);
    } catch (err) {
      console.error('Error loading movie details:', err);
      setError('Erro ao carregar detalhes do filme.');
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteClick = async () => {
    if (!user) {
      alert('Faça login para adicionar aos favoritos');
      return;
    }

    try {
      if (favorited) {
        await removeFromFavorites(user.id, movie.id);
        setFavorited(false);
      } else {
        await addToFavorites(user.id, movie);
        setFavorited(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleLibraryClick = async () => {
    if (!user) {
      alert('Faça login para adicionar à biblioteca');
      return;
    }

    try {
      if (isInLibrary) {
        await libraryService.removeFromLibrary(movie.id);
        setIsInLibrary(false);
      } else {
        await libraryService.addToLibrary(movie);
        setIsInLibrary(true);
      }
    } catch (error) {
      console.error('Error toggling library:', error);
    }
  };

  const handleWatchClick = () => {
    alert('Funcionalidade de streaming será implementada em breve!');
  };

  const handleCloseTrailer = () => {
    setShowTrailer(false);
  };

  if (loading) {
    return <LoadingContainer>Carregando...</LoadingContainer>;
  }

  if (error || !movie) {
    return <ErrorContainer>{error || 'Filme não encontrado'}</ErrorContainer>;
  }

  const backdropUrl = movie.backdrop_path 
    ? getImageUrl(movie.backdrop_path).replace('w500', 'original')
    : '';

  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
  const runtime = movie.runtime ? `${movie.runtime} min` : 'N/A';

  return (
    <PageContainer>
      <HeroSection backdropUrl={backdropUrl}>
        <BackButton onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </BackButton>
        
        <HeroContent>
          <PosterContainer>
            {movie.poster_path ? (
              <MoviePoster 
                src={getImageUrl(movie.poster_path)} 
                alt={movie.title}
              />
            ) : (
              <div style={{width: '300px', height: '450px', background: '#333', borderRadius: '12px'}} />
            )}
            <FavoriteButton 
              isFavorited={favorited}
              onClick={handleFavoriteClick}
            >
              <FontAwesomeIcon icon={favorited ? faHeart : faHeartRegular} />
            </FavoriteButton>
            <LibraryButton 
              isInLibrary={isInLibrary}
              onClick={handleLibraryClick}
            >
              <FontAwesomeIcon icon={faBookmark} />
            </LibraryButton>
          </PosterContainer>

          <MovieInfo>
            <MovieTitle>{movie.title}</MovieTitle>
            
            <MovieMeta>
              <MetaItem>
                <FontAwesomeIcon icon={faCalendarAlt} />
                {releaseYear}
              </MetaItem>
              <MetaItem>
                <FontAwesomeIcon icon={faClock} />
                {runtime}
              </MetaItem>
              <MetaItem>
                <Rating>
                  <FontAwesomeIcon icon={faStar} /> {rating}
                </Rating>
              </MetaItem>
            </MovieMeta>

            {movie.genres && movie.genres.length > 0 && (
              <GenreList>
                {movie.genres.map(genre => (
                  <Genre key={genre.id}>{genre.name}</Genre>
                ))}
              </GenreList>
            )}

            {movie.overview && (
              <Overview>{movie.overview}</Overview>
            )}

            <ActionsContainer>
              <WatchButton onClick={handleWatchClick}>
                <FontAwesomeIcon icon={faPlay} />
                Assistir Agora
              </WatchButton>
              {trailerKey && (
                <TrailerButton onClick={() => setShowTrailer(true)}>
                  <FontAwesomeIcon icon={faVideo} />
                  Ver Trailer
                </TrailerButton>
              )}
            </ActionsContainer>
          </MovieInfo>
        </HeroContent>
      </HeroSection>

      <AnimatePresence>
        {showTrailer && trailerKey && (
          <TrailerModal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseTrailer}
          >
            <TrailerContainer
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <CloseButton onClick={handleCloseTrailer}>
                <FontAwesomeIcon icon={faTimes} />
              </CloseButton>
              <YouTube
                videoId={trailerKey}
                opts={{
                  width: '100%',
                  height: '100%',
                  playerVars: {
                    autoplay: 1,
                    modestbranding: 1,
                    rel: 0
                  }
                }}
              />
            </TrailerContainer>
          </TrailerModal>
        )}
      </AnimatePresence>

      {movie.credits && movie.credits.cast && movie.credits.cast.length > 0 && (
        <CastSection>
          <SectionTitle>Elenco Principal</SectionTitle>
          <CastGrid>
            {movie.credits.cast.slice(0, 10).map(actor => (
              <CastMember key={actor.id}>
                {actor.profile_path ? (
                  <CastImage 
                    src={getImageUrl(actor.profile_path)} 
                    alt={actor.name}
                  />
                ) : (
                  <div style={{width: '100%', height: '200px', background: '#333', borderRadius: '8px', marginBottom: '0.5rem'}} />
                )}
                <CastName>{actor.name}</CastName>
                <CastCharacter>{actor.character}</CastCharacter>
              </CastMember>
            ))}
          </CastGrid>
        </CastSection>
      )}
    </PageContainer>
  );
}

export default MovieDetails;