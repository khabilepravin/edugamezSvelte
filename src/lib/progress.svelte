<script>
	export let currentProgress;
	export let currentItemNumber;
	export let totalItems;
</script>

<div class="row">
	<div class="col-sm">
		<progress max="100" value={currentProgress} />
	</div>
</div>
<div class="row">
	<div class="col-sm">
		<span><h5>{currentItemNumber} of {totalItems}</h5></span>
	</div>
</div>

<style>
	progress {
		display: inline-block;
		margin-right: 10px;
		margin-top: 10px;
		width: 80%;
		height: 30px;
		align-self: center;
	}
	span {
		vertical-align: top;
		margin-left: 10px;
		display: inline-block;
	}
</style>
