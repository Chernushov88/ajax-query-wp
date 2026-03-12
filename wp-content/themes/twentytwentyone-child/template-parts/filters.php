<div class="container">
	<form action="myfilter " method="POST" id="filter">
		<div class="row">
			<div class="col">
				<?php
					// категории
					if( $terms = get_terms( array( 'taxonomy' => 'category', 'orderby' => 'name' ) ) ) { // как я уже говорил, для простоты возьму рубрики category, но get_terms() позволяет работать с любой таксономией
						echo '<select name="categoryfilter"><option value="">Select category...</option>';
						foreach ( $terms as $term ) {
							echo '<option value="' . $term->term_id . '">' . $term->name . '</option>'; // в качестве value я взял ID рубрики
						}
						echo '</select>';
					}
					?>
			</div>
			<div class="col">
				<input type="text" name="cena_min" placeholder="Minimum price" />
			</div>
			<div class="col"> 
				<input type="text" name="cena_max" placeholder="Maximum price" />
			</div>
			<div class="col"> <!-- дата по возрастанию/убыванию -->
				<label><input type="radio" name="date" value="ASC" /> Date: ascending</label>				
				<label><input type="radio" name="date" value="DESC" checked="checked" />Date: descending</label>
			</div>
			<div class="col"><!-- чекбокс только с фото -->
				<label><input type="checkbox" name="featured_image" />Only with thumbnail</label>
			</div>
			<br>
		</div>
		<button>Apply filter</button>
		<input type="hidden" name="action" value="myfilter">
	</form>
	<div id="response"><!-- тут фактически можете вывести посты без фильтрации --></div>
</div>






